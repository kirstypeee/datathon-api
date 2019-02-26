import { appEnv, logger } from 'garage-utils';
import errorHandler from '../errorHandler';

let req, res, next;

beforeEach(() => {
  req = {};
  res = {
    send: jest.fn(),
    status: jest.fn()
  };
  next = jest.fn();

  res.send.mockImplementation(() => res);
  res.status.mockImplementation(() => res);
});

test('error handler sets response status', () => {
  const error = {
    status: 400
  };
  errorHandler(error, req, res, next);
  expect(res.status.mock.calls[0][0]).toBe(400);
});

test('error handler sends error body', () => {
  const error = {
    status: 500,
    message: 'Some error'
  };
  errorHandler(error, req, res, next);
  expect(res.send.mock.calls[0][0]).toEqual({
    message: 'Some error',
    stack: undefined,
    status: 500
  });
});

test('error handler sends error stack in development', () => {
  const error = {
    status: 500,
    message: 'Some error',
    stack: 'at some method'
  };
  errorHandler(error, req, res, next);
  expect(res.send.mock.calls[0][0]).toEqual({
    message: 'Some error',
    stack: 'at some method',
    status: 500
  });
});

test('error handler logs all 500 errors', () => {
  const origError = logger.error;
  logger.error = jest.fn();
  let error = {
    status: 501,
    message: 'Some error'
  };
  errorHandler(error, req, res, next);
  expect(logger.error).toHaveBeenCalled();
  expect(logger.error.mock.calls[0][0]).toEqual(error);

  logger.error = origError;
});

test('error handler does not send stack in production', () => {
  const origEnv = appEnv.isProd;
  appEnv.isProd = jest.fn().mockReturnValue(true);
  const error = {
    status: 500,
    message: 'Some error',
    stack: 'at some method'
  };
  errorHandler(error, req, res, next);
  expect(res.send.mock.calls[0][0]).toEqual({
    message: 'Some error',
    status: 500
  });
  appEnv.isProd = origEnv;
});

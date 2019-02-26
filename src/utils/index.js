import { errors } from 'garage-utils';

const serialAsyncMap = async (array, fn) => {
  let result = [];
  for (let item of array) {
    result.push(await fn(item));
  }
  return result;
};

const serialAsyncForEach = async (array, fn) => {
  for (let index = 0; index < array.length; index++) {
    await fn(array[index], index, array);
  }
};

// promise rejection handler
const asyncWrapper = f => async (req, res, next) => f(req, res, next).catch(next);

const withRequestValidation = f => authToken => async (req, res, next) => {
  const contentType = req.headers['content-type'];
  // check for token header and reject if doesn't match
  const headerToken = req.get('token');

  if (!headerToken || headerToken !== authToken) {
    return next(errors.badRequest('Bad Token'));
  } else if (!contentType || contentType.indexOf('application/json') === -1) {
    return next(errors.badRequest('Bad content-type'));
  }

  return f(req, res, next).catch(next);
};

const to = promise => promise.then(data => [null, data]).catch(err => [err]);

module.exports = {
  serialAsyncForEach,
  serialAsyncMap,
  asyncWrapper,
  withRequestValidation,
  to
};

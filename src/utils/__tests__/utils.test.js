import { serialAsyncMap, serialAsyncForEach, withRequestValidation, to } from '../index';

const waitFor = ms => new Promise(r => setTimeout(r, ms));

describe('Utils', () => {
  describe('serialAsyncMap', () => {
    test('simply array', async () => {
      let result = await serialAsyncMap([1, 2, 3], async num => {
        return num;
      });
      expect(result).toEqual([1, 2, 3]);
    });

    test('simply array with delay', async () => {
      let result = await serialAsyncMap([1, 2, 3], async num => {
        const delay = Math.random() * 50;
        await waitFor(delay);
        return num;
      });
      expect(result).toEqual([1, 2, 3]);
    });
  });
  describe('serialAsyncForEach', () => {
    test('simply array', async () => {
      const result = [];
      result.push(0);
      await serialAsyncForEach([1, 2, 3], async num => {
        result.push(await Promise.resolve(num));
      });
      result.push(4);
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });

    test('simply array with delay', async () => {
      const result = [];
      result.push(0);
      await serialAsyncForEach([1, 2, 3], async num => {
        await waitFor(Math.random() * 50);
        result.push(await Promise.resolve(num));
      });
      result.push(4);
      expect(result).toEqual([0, 1, 2, 3, 4]);
    });
  });

  describe('withRequestValidation', () => {
    test('resturns 400 bad request if the token header is missing', () => {
      const req = { headers: { 'content-type': 'application/json' }, get: jest.fn() };
      const next = jest.fn();
      withRequestValidation()('12345')(req, {}, next);
      expect(next).toBeCalledWith(Error('Bad request: Bad Token'));
    });
    test('returns 400 bad token if configured token does not match request token', () => {
      const req = {
        headers: { 'content-type': 'application/json' },
        get: jest.fn().mockReturnValue('56789')
      };
      const next = jest.fn();
      withRequestValidation()('12345')(req, {}, next);
      expect(next).toBeCalledWith(Error('Bad request: Bad Token'));
    });
    test('resturns 400 bad request if the content-type header is missing', () => {
      const req = {
        headers: { 'content-type': 'text/plain' },
        get: jest.fn().mockReturnValue('12345')
      };
      const next = jest.fn();
      withRequestValidation()('12345')(req, {}, next);
      expect(next).toBeCalledWith(Error('Bad request: Bad content-type'));
    });
    test('calls the handler function if request validation succeeds', () => {
      const handlerFn = jest.fn().mockResolvedValue();
      const req = {
        headers: { 'content-type': 'application/json' },
        get: jest.fn().mockReturnValue('12345')
      };
      const next = jest.fn();
      withRequestValidation(handlerFn)('12345')(req, {}, next);
      expect(handlerFn).toHaveBeenCalled();
    });
  });

  describe('to', () => {
    it('returns a value when promise is fullfilled', async () => {
      const expectedValue = 42;
      const fn = async () => {
        await waitFor(Math.random() * 10);
        return expectedValue;
      };

      const [err, data] = await to(fn());

      expect(err).toBeNull();
      expect(data).toEqual(expectedValue);
    });
    it('returns an error when promise is rejected', async () => {
      const fn = async () => Promise.reject('Error');

      const [err, data] = await to(fn());

      expect(err).toEqual('Error');
      expect(data).toBeUndefined();
    });

    it('returns an error when async function throws an error', async () => {
      const fn = async () => {
        throw new Error('Error');
      };

      const [err, data] = await to(fn());

      expect(err).toEqual(Error('Error'));
      expect(data).toBeUndefined();
    });
  });
});

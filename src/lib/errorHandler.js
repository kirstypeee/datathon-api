import { appEnv, errors, logger } from 'garage-utils';

const errorHandler = (err, req, res, next) => {
  const body = errors.responseBody(err);
  const status = body.status;
  res.status(status);
  if (status >= 500) {
    logger.error(err, {});
  }
  if (!appEnv.isProd()) {
    body.stack = errors.stackWithCause(err);
  }
  res.send(body);
};

export default errorHandler;

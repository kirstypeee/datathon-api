function requiredParam(param, status = 400) {
  const requiredParamError = new Error(`Required parameter "${param}" is missing.`);
  // preserve original stack trace
  Error.captureStackTrace(requiredParamError, requiredParam);
  requiredParamError.status = status;
  throw requiredParamError;
}

export default requiredParam;

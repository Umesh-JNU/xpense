class ErrorHandler extends Error {
  constructor(msg, status) {
    super(msg);
    this.statusCode = status;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = (message, statusCode = 400) => {
  throw new ErrorHandler(message, statusCode);
};

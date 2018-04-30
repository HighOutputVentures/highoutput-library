class HttpError extends Error {
  constructor(code, status, description, meta) {
    super();
    this.code = code;
    this.status = status;
    this.description = description;
    this.meta = meta;
  }
}

class EmailExists extends HttpError {
  constructor(description, meta) {
    super('EMAIL_EXISTS', 400, description, meta);
  }
}

class UserNotFound extends HttpError {
  constructor(description, meta) {
    super('USER_NOT_FOUND', 404, description, meta);
  }
}

module.exports = {
  EmailExists,
  UserNotFound,
};

class ApplicationError extends Error {
  constructor(code, description, meta) {
    super(`${code}: ${description}`);
    this.code = code;
    this.description = description;
    this.meta = meta;
  }

  toJSON() {
    return {
      code: this.code,
      description: this.description,
      meta: this.meta,
    };
  }
}

class EmailExistsError extends ApplicationError {
  constructor(description, meta) {
    super('EMAIL_EXISTS', description, meta);
  }

  get statusCode() {
    return 409;
  }
}

class UserNotFoundError extends ApplicationError {
  constructor(description, meta) {
    super('USER_NOT_FOUND', description, meta);
  }

  get statusCode() {
    return 404;
  }
}

class UserAlreadyExistsError extends ApplicationError {
  constructor(description, meta) {
    super('USER_ALREADY_EXISTS', description, meta);
  }

  get statusCode() {
    return 400;
  }
}

class InvalidParamsError extends ApplicationError {
  constructor(description, meta) {
    super('INVALID_PARAMS', description, meta);
  }

  get statusCode() {
    return 400;
  }
}

class InvalidCredentialsError extends ApplicationError {
  constructor(description, meta) {
    super('INVALID_CREDENTIALS', description, meta);
  }

  get statusCode() {
    return 401;
  }
}

class ForbiddenError extends ApplicationError {
  constructor(description, meta) {
    super('FORBIDDEN', description, meta);
  }

  get statusCode() {
    return 403;
  }
}

module.exports = ApplicationError;
module.exports.EmailExistsError = EmailExistsError;
module.exports.UserNotFoundError = UserNotFoundError;
module.exports.InvalidParamsError = InvalidParamsError;
module.exports.InvalidCredentialsError = InvalidCredentialsError;
module.exports.ForbiddenError = ForbiddenError;
module.exports.UserAlreadyExistsError = UserAlreadyExistsError;

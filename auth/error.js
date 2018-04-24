class AuthError extends Error {
  constructor(code, message, meta) {
    super(`${code} - ${message}`);
    this.code = code;
    this.message = message;

    if (meta) {
      this.meta = meta;
    }
  }

  toJSON() {
    return {
      ...(this.meta || {}),
      code: this.code,
      message: this.message,
    };
  }
}

module.exports = AuthError;

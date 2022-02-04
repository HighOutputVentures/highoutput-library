/* eslint-disable max-classes-per-file */
export class OpenCircuitError extends Error {
  constructor() {
    super('Circuit is open.');
  }
}

export class TimeoutError extends Error {
  constructor() {
    super('Operation timed out.');
  }
}

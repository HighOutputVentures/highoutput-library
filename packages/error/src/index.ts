import shortid from 'shortid';

export default class AppError<T = Record<string, any>> extends Error {
  public readonly service?: string = process.env.SERVICE || process.env.SERVICE_NAME;

  public readonly id: string = shortid.generate();

  public readonly name: string = 'AppError';

  public constructor(
    public readonly code: string,
    message: string,
    meta?: T,
  ) {
    super(message);

    if (meta) {
      for (const [key, value] of Object.entries(meta)) {
        (this as Record<string, any>)[key] = value;
      }
    }
  }
}

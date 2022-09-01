declare namespace Express {
  export interface Request {
    context: {
      configPath?: string;
      endpointSecret?: string;
    };
  }
}

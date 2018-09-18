declare module 'highoutput-utilities' {
  export class Logger {
    constructor(tags: string[]);
    tag(tag: string): Logger;
    info(...args: any[]): void;
    error(...args: any[]): void;
    verbose(...args: any[]): void;
    warn(...args: any[]): void;
  }
}

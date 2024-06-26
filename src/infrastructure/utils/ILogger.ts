export interface ILogger {
  info(message: string, meta?: any): void;
  error(message: string, meta?: any): void;
}

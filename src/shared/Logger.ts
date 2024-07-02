export class Logger {
  static log(message: unknown): void {
    console.log(message);
  }

  static error(message: unknown): void {
    console.error(message);
  }

  static warn(message: unknown): void {
    console.warn(message);
  }

  static info(message: unknown, ctx?: unknown): void {
    console.info(message, ctx);
  }
}
export class Logger {
  static log(message: string): void {
    console.log(message);
  }

  static error(message: string): void {
    console.error(message);
  }

  static warn(message: string): void {
    console.warn(message);
  }

  static info(message: string, ctx?: unknown): void {
    console.info(message, ctx);
  }
}
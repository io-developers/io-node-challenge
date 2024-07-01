export abstract class Command {}

export interface CommandHandler<T>{
  handle(command: Command): Promise<T>;
}
export abstract class EventDomain {}

export interface EventHandler {
  handle(event: EventDomain): Promise<void>;
}
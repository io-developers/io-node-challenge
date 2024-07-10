import { EventDomain, EventHandler } from "./EventHandler";
import { Logger } from "./Logger";

export class EventPublisher {
  private eventHandlers: Record<string, EventHandler[]> = {};

  private static instance: EventPublisher;

  private constructor() {}

  static getInstance(): EventPublisher {
    if (!EventPublisher.instance) {
      EventPublisher.instance = new EventPublisher();
    }

    return EventPublisher.instance;
  }

  register(event: EventDomain, handler: EventHandler): void {
    if (!this.eventHandlers[event.constructor.name]) {
      this.eventHandlers[event.constructor.name] = [];
    }

    this.eventHandlers[event.constructor.name].push(handler);
  }

  async publish(event: EventDomain): Promise<void> {
    Logger.info(`Publishing event: ${event.constructor.name}`);

    const events = this.eventHandlers[event.constructor.name];

    if (!events || !Array.isArray(events) || events.length === 0) {
      return;
    }

    const tasks = events.map((handler) => () => handler.handle(event));

    Logger.info(`Publishing event: ${event.constructor.name}`);

    try {
      await Promise.allSettled(tasks.map((task) => task()));
    } catch (e) {
      Logger.error(`Failed to publish event: ${event.constructor.name}`);
      Logger.error(e);
    }
  } 
} 
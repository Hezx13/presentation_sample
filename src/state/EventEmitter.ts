type EventListener = (...args: any[]) => void;

class EventEmitter {
  private events: Record<string, EventListener[]>;

  constructor() {
    this.events = {};
  }

  on(eventName: string, fn: EventListener): void {
    console.log("ON Emitter called", eventName)
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }

  off(eventName: string, fn: EventListener): void {
    console.log("OFF Emitter called", eventName)

    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(eventFn => eventFn !== fn);
    }
  }

  emit(eventName: string, ...args: any[]): void {
    console.log("Emitter called", eventName)
    const event = this.events[eventName];
    if (event) {
      event.forEach(fn => {
        fn(...args);
      });
    }
  }
}

export const eventEmitter = new EventEmitter();

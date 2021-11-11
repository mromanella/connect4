
class EventController {

    private registeredEvents: Map<string, Map<string, any[]>> = new Map<string, Map<string, any[]>>();

    register(name: string, callback: Function, ...args: any[]) {
        const packed = [callback, ...args];
        const key = String(packed);
        if (!this.registeredEvents.has(name)) {
            const newRegistration = new Map<string, any[]>();
            this.registeredEvents.set(name, newRegistration);
        }
        const registered = this.registeredEvents.get(name);
        registered.set(key, packed);
    }

    unregister(name: string, callback: Function, ...args: any[]) {
        if (this.registeredEvents.has(name)) {
            const key = String([callback, ...args])
            const registered = this.registeredEvents.get(name);
            registered.delete(key);
        }
    }

    trigger(name: string) {
        if (this.registeredEvents.has(name)) {
            const registered = this.registeredEvents.get(name);
            for (let [callback, ...args] of registered.values()) {
                callback(...args);
            }
        }
    }
}

let eventController: EventController = null;

function getEventController(): EventController {
    if (!eventController) {
        eventController = new EventController();
    }
    return eventController;
}

export { getEventController, EventController };
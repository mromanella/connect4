
class EventController extends Map<string, Map<string, Function[]>> {

    register(name: string, callback: Function, ...args: any[]) {
        const packed = [callback, ...args];
        const key = String(packed);
        if (!this.has(name)) {
            const newRegistration = new Map<string, any[]>();
            this.set(name, newRegistration);
        }
        const registered = this.get(name);
        registered.set(key, packed);
    }

    unregister(name: string, callback: Function, ...args: any[]) {
        if (this.has(name)) {
            const key = String([callback, ...args])
            const registered = this.get(name);
            registered.delete(key);
        }
    }

    trigger(name: string) {
        if (this.has(name)) {
            const registered = this.get(name);
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

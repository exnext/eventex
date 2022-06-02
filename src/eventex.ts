type EventexCallback<T = any, K = any> = (data: T) => K;

interface ItemEvent<T = any, K = any> {
    callback: EventexCallback<T, K>;
    once: boolean;
}

interface DeclaredEvents {
    [name: string]: ItemEvent[]
}

export class Eventex {
    private events: DeclaredEvents = {};

    emit<T = any, K = any>(name: string, data?: T): Promise<Awaited<K>[]> {
        let results: Promise<K>[] = [];
        let toExecute: ItemEvent[] = (this.events[name] || []).filter((event: ItemEvent) => event.callback);

        toExecute.forEach((event: ItemEvent) => {
            if (event.once) {
                this.offEvent(name, event);
            }

            results.push(new Promise(resolve => {
                resolve(event.callback(data));
            }));
        });

        return Promise.all(results);
    }

    once<T = any, K = any>(name: string, callback: EventexCallback<T, K>): this {
        this.events[name] = this.events[name] || [];
        this.events[name].push({ callback, once: true });

        return this;
    }

    on<T = any, K = any>(name: string, callback: EventexCallback<T, K>): this {
        this.events[name] = this.events[name] || [];
        this.events[name].push({ callback, once: false });

        return this;
    }

    off<T = any, K = any>(name: string, callback?: EventexCallback<T, K>): this {
        if (callback) {
            let events: ItemEvent[] = (this.events[name] || []).filter((event: ItemEvent) => event.callback == callback);
            events.forEach((event: ItemEvent) => this.offEvent(name, event));
        } else {
            delete this.events[name];
        }

        return this;
    }

    some(name: string): boolean {
        return !!this.events[name] && (this.events[name].length > 0);
    }

    private offEvent(name: string, event: ItemEvent): void {
        if (this.events[name]) {
            let index: number = this.events[name].indexOf(event);
            this.events[name].splice(index, 1);

            if (!this.events[name].length) {
                delete this.events[name];
            }
        }
    }
}
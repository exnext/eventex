interface CallbackControl<T = any> {
    prevoiusResult?: T;
    handle: boolean;
}

type EventexCallback<T = any, K = any> = (data: T, control?: CallbackControl<K>) => K;

interface ItemEvent<T = any, K = any> {
    callback: EventexCallback<T, K>;
    once: boolean;
}

interface DeclaredEvents {
    [name: string]: ItemEvent[]
}

export class Eventex {
    private events: DeclaredEvents = {};

    private getToExecute(name: string): ItemEvent[] {
        return (name && this.events[name] || []).filter((event: ItemEvent) => event.callback);
    }

    emit<T = any, K = any>(name: string, data?: T): Promise<Awaited<K>[]> {
        let results: Promise<K>[] = [];
        let toExecute: ItemEvent[] = this.getToExecute(name);

        for (let event of toExecute) {
            if (event.once) {
                this.offEvent(name, event);
            }

            results.push(new Promise(resolve => {
                resolve(event.callback(data));
            }));
        }

        return Promise.all(results);
    }

    async emitInSeries<T = any, K = any>(name: string, data?: T): Promise<K | undefined> {
        let toExecute: ItemEvent[] = this.getToExecute(name);

        let control: CallbackControl<K> = {
            prevoiusResult: undefined,
            handle: false
        }

        for (let event of toExecute) {
            if (event.once) {
                this.offEvent(name, event);
            }

            control.prevoiusResult = await new Promise(resolve => {
                resolve(event.callback(data, control));
            });

            if (control.handle) {
                break;
            }
        }

        return control.prevoiusResult;
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
            let events: ItemEvent[] = this.getToExecute(name).filter((event: ItemEvent) => event.callback == callback);
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
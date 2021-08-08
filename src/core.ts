import { ModuleBase } from './base'
import { Thread, ThreadHandler } from './thread'
import { Event, coreEvent, ListenerCallback } from './event'

type EachHandler = (value: any, index: number, done: (data?: any) => void, error: (data: any) => void) => void

export class Core extends ModuleBase {
    unit: ModuleBase
    event: Event
    threads: Thread[] = []
    constructor(name: string, unit: CoreUnit) {
        super(name)
        this.unit = unit
        this.event = new Event(name, coreEvent)
        if (this.install) {
            this.install()
        }
    }

    install() {
        return null
    }

    add(thread: ThreadHandler) {
        this.threads.push(new Thread(this.event, thread))
    }

    each(items: number[] | number, callback: EachHandler) {
        if (typeof items === 'number') {
            for (let i = 0; i < items; i++) {
                this.add((done, error) => callback(i, i, done, error))
            }
        } else {
            for (let i = 0; i < items.length; i++) {
                this.add((done, error) => callback(items[i], i, done, error))
            }
        }
    }

    clear() {
        this.threads = []
    }
}

export class CoreUnit extends ModuleBase {
    _core: Core
    constructor(name: string, ExtendCore: any, parallel: number) {
        super(name)
        this._core = new ExtendCore(this, parallel)
    }

    on(channelName: string, callback: ListenerCallback) {
        return this._core.event.on(channelName, callback)
    }

    off(channelName: string, id: string) {
        return this._core.event.off(channelName, id)
    }

    add(thread: ThreadHandler) {
        this._core.add(thread)
        return this
    }

    each(items: number | number[], thread: EachHandler) {
        this._core.each(items, thread)
        return this
    }

    clear() {
        this._core.clear()
    }
}

import { ModuleBase } from './base'
import { Helper } from './helper'

type EventContext = {
    name: string
    type: string
    context: any
}

export type ListenerExport = {
    id: string
    off: () => void
}

export type ListenerCallback = (event: EventContext & { listener: ListenerExport }) => void

export class Event extends ModuleBase {
    name: string
    parent?: Event
    channels: Record<string, Channel>
    constructor(name: string, parent?: Event) {
        super('Event')
        this.name = name
        this.parent = parent
        this.channels = {}
    }

    addChannel(name: string) {
        this.channels[name] = new Channel()
    }

    getChannel(name: string) {
        if (this.channels[name] == null) {
            this.addChannel(name)
        }
        return this.channels[name]
    }

    on(channelName: string, callback: ListenerCallback) {
        return this.getChannel(channelName).addListener(callback)
    }

    off(channelName: string, target: string | { id: string }) {
        let event = typeof target === 'string' ? target : target.id
        this.getChannel(channelName).removeListener(event)
    }

    emit(channelName: string, context = {}) {
        let event = {
            name: this.name,
            type: channelName,
            context
        }
        if (this.parent) {
            this.parent.emit(channelName, event)
        }
        this.getChannel(channelName).broadcast(event)
    }
}

class Channel extends ModuleBase {
    listeners: Record<string, Listener> = {}
    constructor() {
        super('Channel')
    }

    hasListener(id: string) {
        if (this.listeners[id] == null) {
            this.$devError('hasListener', `Listener id(${id}) not found.`)
        }
    }

    addListener(callback: ListenerCallback) {
        if (typeof callback !== 'function') {
            this.$devError('addListener', `Callback must be a function`)
        }
        let id = Helper.generateId()
        this.listeners[id] = new Listener(this, id, callback)
        return this.listeners[id].export
    }

    removeListener(id: string) {
        this.hasListener(id)
        delete this.listeners[id]
    }

    broadcast(context: EventContext) {
        for (let listener of Object.values(this.listeners)) {
            listener.trigger(context)
        }
    }
}

class Listener extends ModuleBase {
    id: string
    channel: Channel
    callback: ListenerCallback
    export: ListenerExport
    constructor(channel: Channel, id: string, callback: ListenerCallback) {
        super('Listener')
        this.id = id
        this.channel = channel
        this.callback = callback
        this.export = {
            id: this.id,
            off: () => { this.channel.removeListener(this.id) }
        }
    }

    trigger(context: EventContext) {
        this.callback({
            ...context,
            listener: this.export
        })
    }
}

export const coreEvent = new Event('core')

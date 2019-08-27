const Base = require('./base')
const Helper = require('./helper')

class Event extends Base {
    constructor(name, parent) {
        super('Event')
        this.name = name
        this.parent = parent
        this.channels = {}
    }

    addChannel(name) {
        this.channels[name] = new Channel(this)
    }

    getChannel(name) {
        if (this.channels[name] == null) {
            this.addChannel(name)
        }
        return this.channels[name]
    }

    on(channelName, callback) {
        return this.getChannel(channelName).addListener(callback)
    }

    off(channelName, target) {
        let event = typeof target === 'string' ? target : target.id
        this.getChannel(channelName).removeListener(event)
    }

    emit(channelName, context = {}) {
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

class Channel extends Base {
    constructor() {
        super('Channel')
        this.listeners = {}
    }

    hasListener(id) {
        if (this.listeners[id] == null) {
            this.$devError('hasListener', `Listener id(${id}) not found.`)
        }
    }

    addListener(callback) {
        if (typeof callback !== 'function') {
            this.$devError('addListener', `Callback must be a function`, callback)
        }
        let id = Helper.generateId()
        this.listeners[id] = new Listener(this, id, callback)
        return this.listeners[id].export
    }

    removeListener(id) {
        this.hasListener(id)
        delete this.listeners[id]
    }

    broadcast(context) {
        for (let listener of Object.values(this.listeners)) {
            listener.trigger(context)
        }
    }
}

class Listener extends Base {
    constructor(channel, id, callback) {
        super('Listener')
        this.id = id
        this.channel = channel
        this.callback = callback
        this.export = {
            id: this.id,
            off: () => { this.channel.removeListener(this.id) }
        }
    }

    trigger(context) {
        this.callback({
            ...context,
            listener: this.export
        })
    }
}

module.exports = Event

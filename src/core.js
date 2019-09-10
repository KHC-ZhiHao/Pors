const Base = require('./base')
const Event = require('./event')
const Thread = require('./thread')
const coreEvent = require('./core_event')

class Core extends Base {
    constructor(name, unit) {
        super(name)
        this.unit = unit
        this.event = new Event(name, coreEvent)
        this.threads = []
        if (this.install) {
            this.install()
        }
    }

    add(thread) {
        this.threads.push(new Thread(this.event, thread))
    }

    each(items, callback) {
        let type = typeof items
        let length = type === 'number' ? items : items.length
        for (let i = 0; i < length; i++) {
            this.add((done, error) => {
                if (type === 'number') {
                    callback(i, i, done, error)
                } else {
                    callback(items[i], i, done, error)
                }
            })
        }
    }

    clear() {
        this.threads = []
    }
}

Core.Unit = class extends Base {
    constructor(name, ExtendCore, parallel) {
        super(name)
        this._core = new ExtendCore(this, parallel)
    }

    on(channelName, callback) {
        return this._core.event.on(channelName, callback)
    }

    off(channelName, id) {
        return this._core.event.off(channelName, id)
    }

    add(thread) {
        this._core.add(thread)
        return this
    }

    each(items, thread) {
        this._core.each(items, thread)
        return this
    }

    clear() {
        this._core.clear()
    }
}

module.exports = Core

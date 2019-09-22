const Core = require('./core')

class PawnCore extends Core {
    constructor(unit, parallel) {
        super('Pawn', unit)
        this.queue = 0
        this.parallel = parallel
    }

    install() {
        this.event.on('run', () => {
            this.queue += 1
        })
        this.event.on('done', () => {
            this.lessQueue()
            this.run()
        })
        this.event.on('error', () => {
            this.lessQueue()
            this.run()
        })
    }

    add(thread) {
        super.add(thread)
        this.run()
    }

    lessQueue() {
        this.queue -= 1
        if (this.queue <= 0) {
            this.queue = 0
        }
        if (this.threads.length <= 0) {
            this.event.emit('empty')
        }
    }

    clear() {
        super.clear()
        this.queue = 0
    }

    run() {
        if (this.parallel && this.queue >= this.parallel) {
            return null
        }
        let thread = this.threads.shift()
        if (thread) {
            thread.run()
        }
    }

    onEmpty(callback) {
        if (this.threads.length <= 0) {
            callback()
        }
        return this.event.on('empty', callback)
    }
}

class Pawn extends Core.Unit {
    constructor(parallel) {
        super('Pawn', PawnCore, parallel)
    }

    get size() {
        return this._core.threads.length + this._core.queue
    }

    onEmpty(callback) {
        return this._core.onEmpty(callback)
    }
}

module.exports = Pawn

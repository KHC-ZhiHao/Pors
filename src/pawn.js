const Core = require('./Core')

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
}

class Pawn extends Core.Unit {
    constructor(parallel) {
        super('Pawn', PawnCore, parallel)
    }
}

module.exports = Pawn

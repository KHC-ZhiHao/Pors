import { Core, CoreUnit } from './core'
import { ThreadHandler } from './thread'

class PawnCore extends Core {
    queue = 0
    parallel: number
    constructor(unit: Pawn, parallel: number) {
        super('Pawn', unit)
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
        return null
    }

    add(thread: ThreadHandler) {
        super.add(thread)
        this.run()
    }

    addFirst(thread: ThreadHandler) {
        super.addFirst(thread)
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

    onEmpty(callback: () => void) {
        if (this.threads.length <= 0) {
            callback()
        }
        return this.event.on('empty', callback)
    }
}

export class Pawn extends CoreUnit {
    declare _core: PawnCore
    constructor(parallel: number) {
        super('Pawn', PawnCore, parallel)
    }

    get size() {
        return this._core.threads.length + this._core.queue
    }

    addFirst(thread: ThreadHandler) {
        this._core.addFirst(thread)
        return this
    }

    onEmpty(callback: () => void) {
        return this._core.onEmpty(callback)
    }
}

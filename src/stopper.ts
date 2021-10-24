import { Core, CoreUnit } from './core'
import { Event, ListenerExport } from './event'
import { Thread, ThreadAsyncHandler } from './thread'

type StopperHandler = (error?: any) => void

class StopperCore extends Core {
    parallel: number
    constructor(unit: Stopper, parallel: number) {
        super('Stopper', unit)
        this.parallel = parallel
    }

    start(callback: StopperHandler) {
        if (typeof callback !== 'function') {
            this.$devError('start', 'Callback not a function.')
        }
        return (new StopperProcess(this, callback)).exports
    }
}

class StopperProcess {
    core: StopperCore
    event: Event
    isStop = false
    loaded = 0
    threads: Thread[]
    totalThread: number
    callback: StopperHandler
    doneEvent!: ListenerExport
    errorEvent!: ListenerExport
    exports = {
        close: () => this.close()
    }
    constructor(core: StopperCore, callback: StopperHandler) {
        this.core = core
        this.event = core.event
        this.threads = core.threads.slice()
        this.totalThread = this.threads.length
        this.callback = callback
        this.initEvent()
        this.start()
    }

    initEvent() {
        this.doneEvent = this.event.on('done', () => {
            this.run()
            this.loaded += 1
            this.core.event.emit('process', {
                loaded: this.loaded,
                totalThread: this.totalThread
            })
            if (this.loaded >= this.totalThread) {
                this.stop()
            }
        })
        this.errorEvent = this.event.on('error', (event) => {
            this.stop(event.context.result)
        })
    }

    start() {
        if (this.threads.length === 0) {
            return this.stop()
        }
        let parallelLength = this.core.parallel || this.threads.length
        for (let i = 0; i < parallelLength; i++) {
            this.run()
        }
    }

    stop(error?: any) {
        if (this.isStop === false) {
            this.callback(error)
            this.close()
        }
    }

    close() {
        this.doneEvent.off()
        this.errorEvent.off()
        this.isStop = true
    }

    run() {
        if (this.isStop) {
            return null
        }
        let thread = this.threads.shift()
        if (thread) {
            thread.run()
        }
    }
}

export class Stopper extends CoreUnit {
    declare _core: StopperCore
    constructor(parallel: number) {
        super('Stopper', StopperCore, parallel)
    }

    addAsync(thread: ThreadAsyncHandler) {
        this.add(async(done, fail) => {
            try {
                await thread()
                done()
            } catch (error) {
                fail(error)
            }
        })
        return this
    }

    start(callback: StopperHandler) {
        return this._core.start(callback)
    }
}

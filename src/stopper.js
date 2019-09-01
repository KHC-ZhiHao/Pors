const Core = require('./core')

class StopperCore extends Core {
    constructor(unit, parallel) {
        super('Stopper', unit)
        this.parallel = parallel
    }

    start(callback) {
        if (typeof callback !== 'function') {
            this.$devError('start', 'Callback not a function.')
        }
        new StopperProcess(this, callback)
    }
}

class StopperProcess {
    constructor(core, callback) {
        this.core = core
        this.event = core.event
        this.isStop = false
        this.loaded = 0
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
        let parallelLength = this.core.parallel || this.threads.length
        for (let i = 0; i < parallelLength; i++) {
            this.run()
        }
    }

    stop(error) {
        if (this.isStop === false) {
            this.callback(error)
            this.doneEvent.off()
            this.errorEvent.off()
            this.isStop = true
        }
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

class Stopper extends Core.Unit {
    constructor(parallel) {
        super('Stopper', StopperCore, parallel)
    }

    start(callback) {
        this._core.start(callback)
    }
}

module.exports = Stopper

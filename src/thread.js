const Base = require('./base')
const Helper = require('./helper')

class Thread extends Base {
    constructor(event, thread) {
        super('Thread')
        this.id = Helper.generateId()
        this.event = event
        this.thread = thread
        this.done = data => this.close('done', data)
        this.error = data => this.close('error', data)
        if (typeof thread !== 'function') {
            this.$devError('add', 'Thread not a function.')
        }
    }

    run() {
        this.event.emit('run', { id: this.id })
        this.thread(this.done, this.error)
    }

    close(type, result) {
        this.event.emit(type, {
            id: this.id,
            result,
            thread: this.thread
        })
        this.done = () => this.$devError('close', 'This thread is done.')
        this.error = () => this.$devError('close', 'This thread is done.')
    }
}

module.exports = Thread

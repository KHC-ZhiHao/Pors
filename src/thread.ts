import { Event } from './event'
import { Helper } from './helper'
import { ModuleBase } from './base'

export type ThreadHandler = (done: (data?: any) => void, error: (data: any) => void) => void
export type ThreadAsyncHandler = () => Promise<any>

export class Thread extends ModuleBase {
    id = Helper.generateId()
    event: Event
    thread: ThreadHandler
    done = (data: any) => this.close('done', data)
    error = (data: any) => this.close('error', data)
    constructor(event: Event, thread: ThreadHandler) {
        super('Thread')
        this.event = event
        this.thread = thread
        if (typeof thread !== 'function') {
            this.$devError('add', 'Thread not a function.')
        }
    }

    run() {
        this.event.emit('run', { id: this.id })
        this.thread(this.done, this.error)
    }

    close(type: any, result: any) {
        this.event.emit(type, {
            id: this.id,
            result,
            thread: this.thread
        })
        this.done = () => this.$devError('close', 'This thread is done.')
        this.error = () => this.$devError('close', 'This thread is done.')
    }
}

import { Pawn as _Pawn } from './pawn'
import { Pump as _Pump } from './pump'
import { Stopper as _Stopper } from './stopper'
import { coreEvent, ListenerCallback } from './event'

export const Pawn = _Pawn
export const Pump = _Pump
export const Stopper = _Stopper

export const pawn = (parallel: number) => {
    return new Pawn(parallel)
}

export const pump = (finish: () => void) => {
    return new Pump(finish)
}

export const stopper = (parallel: number) => {
    return new Stopper(parallel)
}

export const on = (channelName: string, callback: ListenerCallback) => {
    return coreEvent.on(channelName, callback)
}

export const off = (channelName: string, id: string) => {
    return coreEvent.off(channelName, id)
}

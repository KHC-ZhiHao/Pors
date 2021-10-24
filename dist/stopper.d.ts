import { Core, CoreUnit } from './core';
import { ThreadAsyncHandler } from './thread';
declare type StopperHandler = (error?: any) => void;
declare class StopperCore extends Core {
    parallel: number;
    constructor(unit: Stopper, parallel: number);
    start(callback: StopperHandler): {
        close: () => void;
    };
}
export declare class Stopper extends CoreUnit {
    _core: StopperCore;
    constructor(parallel: number);
    addAsync(thread: ThreadAsyncHandler): this;
    start(callback: StopperHandler): {
        close: () => void;
    };
}
export {};

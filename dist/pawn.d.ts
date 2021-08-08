import { Core, CoreUnit } from './core';
import { ThreadHandler } from './thread';
declare class PawnCore extends Core {
    queue: number;
    parallel: number;
    constructor(unit: Pawn, parallel: number);
    install(): null;
    add(thread: ThreadHandler): void;
    lessQueue(): void;
    clear(): void;
    run(): null | undefined;
    onEmpty(callback: () => void): import("./event").ListenerExport;
}
export declare class Pawn extends CoreUnit {
    _core: PawnCore;
    constructor(parallel: number);
    get size(): number;
    onEmpty(callback: () => void): import("./event").ListenerExport;
}
export {};

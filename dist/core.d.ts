import { ModuleBase } from './base';
import { Thread, ThreadHandler } from './thread';
import { Event, ListenerCallback } from './event';
declare type EachHandler = (value: any, index: number, done: (data?: any) => void, error: (data: any) => void) => void;
export declare class Core extends ModuleBase {
    unit: ModuleBase;
    event: Event;
    threads: Thread[];
    constructor(name: string, unit: CoreUnit);
    install(): null;
    add(thread: ThreadHandler): void;
    addFirst(thread: ThreadHandler): void;
    each(items: number[] | number, callback: EachHandler): void;
    clear(): void;
}
export declare class CoreUnit extends ModuleBase {
    _core: Core;
    constructor(name: string, ExtendCore: any, parallel: number);
    on(channelName: string, callback: ListenerCallback): import("./event").ListenerExport;
    off(channelName: string, id: string): void;
    add(thread: ThreadHandler): this;
    each(items: number | number[], thread: EachHandler): this;
    clear(): void;
}
export {};

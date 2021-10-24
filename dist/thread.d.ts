import { Event } from './event';
import { ModuleBase } from './base';
export declare type ThreadHandler = (done: (data?: any) => void, error: (data: any) => void) => void;
export declare type ThreadAsyncHandler = () => Promise<any>;
export declare class Thread extends ModuleBase {
    id: string;
    event: Event;
    thread: ThreadHandler;
    done: (data: any) => void;
    error: (data: any) => void;
    constructor(event: Event, thread: ThreadHandler);
    run(): void;
    close(type: any, result: any): void;
}

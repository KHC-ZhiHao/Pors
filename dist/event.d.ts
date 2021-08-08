import { ModuleBase } from './base';
declare type EventContext = {
    name: string;
    type: string;
    context: any;
};
export declare type ListenerExport = {
    id: string;
    off: () => void;
};
export declare type ListenerCallback = (event: EventContext & {
    listener: ListenerExport;
}) => void;
export declare class Event extends ModuleBase {
    name: string;
    parent?: Event;
    channels: Record<string, Channel>;
    constructor(name: string, parent?: Event);
    addChannel(name: string): void;
    getChannel(name: string): Channel;
    on(channelName: string, callback: ListenerCallback): ListenerExport;
    off(channelName: string, target: string | {
        id: string;
    }): void;
    emit(channelName: string, context?: {}): void;
}
declare class Channel extends ModuleBase {
    listeners: Record<string, Listener>;
    constructor();
    hasListener(id: string): void;
    addListener(callback: ListenerCallback): ListenerExport;
    removeListener(id: string): void;
    broadcast(context: EventContext): void;
}
declare class Listener extends ModuleBase {
    id: string;
    channel: Channel;
    callback: ListenerCallback;
    export: ListenerExport;
    constructor(channel: Channel, id: string, callback: ListenerCallback);
    trigger(context: EventContext): void;
}
export declare const coreEvent: Event;
export {};

import { ModuleBase } from './base';
declare type EachHandler = (press: () => void, count: number) => void;
declare class PumpCore extends ModuleBase {
    total: number;
    count: number;
    options: {
        finish: () => void;
    };
    constructor(finish: () => void);
    press(): number;
    add(count: number): number;
    each(callback: EachHandler): void;
}
/**
 * 非同步loop的解決方案
 * @hideconstructor
 */
export declare class Pump {
    _core: PumpCore;
    constructor(finish: () => void);
    /**
     * 加入指定次數
     * @returns {number} 總計數
     */
    add(count: number): number;
    /**
     * 根據剩餘次數宣告callback，該方法並不會消耗次數
     */
    each(callback: EachHandler): void;
    /**
     * 加一次記數，當計數大於指定次數，呼叫 finish
     */
    press(): number;
}
export {};

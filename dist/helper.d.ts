declare type Types = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'array' | 'empty' | 'NaN' | 'regexp' | 'promise' | 'buffer';
export declare class Helper {
    static getType(target: any): Types;
    static verify<T extends Record<string, any>>(data: T, validates: Record<string, [boolean, Types[], any?]>): T;
    /**
     * 模擬uuid的建構方法，但不是真的uuid，不保證不會重複，但很難重複
     * @static
     * @returns {string}
     */
    static generateId(): string;
}
export {};

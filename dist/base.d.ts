export declare class ModuleBase {
    base: {
        name: string;
    };
    constructor(name: string);
    $devError(functionName: string, message: string): void;
    $systemError(functionName: string, message: string, object?: string): void;
}

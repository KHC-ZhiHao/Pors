export class ModuleBase {
    base: {
        name: string
    }
    constructor(name: string) {
        this.base = { name }
    }

    $devError(functionName: string, message: string) {
        throw new Error(`(☉д⊙)!! Pors::${this.base.name} => ${functionName} -> ${message}`)
    }

    $systemError(functionName: string, message: string, object = '$_no_error') {
        if (object !== '$_no_error') {
            console.log('error data => ', object)
        }
        console.error(`Please take this error message to : https://github.com/KHC-ZhiHao/pors/issues/new`)
        throw new Error(`(☉д⊙)!! System Error, Pors::${this.base.name} => ${functionName} -> ${message}`)
    }
}

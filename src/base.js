class Base {
    constructor(name) {
        this.base = { name }
    }

    $devError(functionName, message) {
        throw new Error(`(☉д⊙)!! Pors::${this.base.name} => ${functionName} -> ${message}`)
    }

    $systemError(functionName, message, object = '$_no_error') {
        if (object !== '$_no_error') {
            console.log('error data => ', object)
        }
        console.error(`Please take this error message to : https://github.com/KHC-ZhiHao/pors/issues/new`)
        throw new Error(`(☉д⊙)!! System Error, Pors::${this.base.name} => ${functionName} -> ${message}`)
    }
}

module.exports = Base

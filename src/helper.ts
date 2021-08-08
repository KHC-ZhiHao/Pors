type Types = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'array' | 'empty' | 'NaN' | 'regexp' | 'promise' | 'buffer'

export class Helper {
    static getType(target: any): Types {
        let type = typeof target
        if (Array.isArray(target)) {
            return 'array'
        }
        if (target == null) {
            return 'empty'
        }
        if (type === 'number' && isNaN(target)) {
            return 'NaN'
        }
        if (target instanceof RegExp) {
            return 'regexp'
        }
        if (target && typeof target.then === 'function') {
            return 'promise'
        }
        if (typeof Buffer !== 'undefined' && Buffer.isBuffer(target)) {
            return 'buffer'
        }
        return type
    }

    static verify<T extends Record<string, any>>(data: T, validates: Record<string, [boolean, Types[], any?]>): T {
        let newData: any = {}
        for (let key in validates) {
            let target = data[key]
            let validate = validates[key]
            let [required, types, defaultValue] = validate
            let type = Helper.getType(target)
            if (Helper.getType(required) !== 'boolean') {
                throw new Error(`Helper::verify => Required must be a boolean`)
            }
            if (Helper.getType(types) !== 'array') {
                throw new Error(`Helper::verify => Types must be a array`)
            }
            if (required && target == null) {
                throw new Error(`Helper::verify => Key(${key}) is required`)
            }
            if (types && target != null && !types.includes(type)) {
                throw new Error(`Helper::verify => Type(${key}::${type}) error, need ${types.join(' or ')}`)
            }
            newData[key] = target === undefined ? defaultValue : target
        }
        return newData
    }

    /**
     * 模擬uuid的建構方法，但不是真的uuid，不保證不會重複，但很難重複
     * @static
     * @returns {string}
     */

    static generateId() {
        let now = Date.now()
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = (now + Math.random() * 16) % 16 | 0
            now = Math.floor(now / 16)
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
        })
    }
}

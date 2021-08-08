import { Helper } from './helper'
import { ModuleBase } from './base'

type EachHandler = (press: () => void, count: number) => void

class PumpCore extends ModuleBase {
    total = 0
    count = 0
    options: {
        finish: () => void
    }
    constructor(finish: () => void) {
        super('Pump')
        this.options = Helper.verify({ finish }, {
            finish: [true, ['function']]
        })
    }

    press() {
        this.count += 1
        if (this.count >= this.total) {
            this.options.finish()
        }
        return this.count
    }

    add(count: number) {
        let type = typeof count
        if (count != null && type !== 'number') {
            this.$devError('add', 'Count not a number.')
        }
        if (type === 'number' && count < 0) {
            this.$devError('add', 'Count cannot be negative.')
        }
        this.total += count
        return this.total
    }

    each(callback: EachHandler) {
        if (typeof callback !== 'function') {
            this.$devError('each', 'Callback not a function')
        }
        let press = this.press.bind(this)
        for (let i = this.count; i < this.total; i++) {
            callback(press, this.count)
        }
    }
}

/**
 * 非同步loop的解決方案
 * @hideconstructor
 */

export class Pump {
    _core: PumpCore
    constructor(finish: () => void) {
        this._core = new PumpCore(finish)
    }

    /**
     * 加入指定次數
     * @returns {number} 總計數
     */

    add(count: number) {
        return this._core.add(count)
    }

    /**
     * 根據剩餘次數宣告callback，該方法並不會消耗次數
     */

    each(callback: EachHandler) {
        return this._core.each(callback)
    }

    /**
     * 加一次記數，當計數大於指定次數，呼叫 finish
     */

    press() {
        return this._core.press()
    }
}

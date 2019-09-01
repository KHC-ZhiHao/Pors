let Pawn = require('./pawn')
let Pump = require('./pump')
let Stopper = require('./stopper')
let coreEvent = require('./core_event')

module.exports = {
    pawn(parallel) {
        return new Pawn(parallel)
    },
    pump(finish) {
        return new Pump(finish)
    },
    stopper(parallel) {
        return new Stopper(parallel)
    },
    on(channelName, callback) {
        return coreEvent.on(channelName, callback)
    },
    off(channelName, id) {
        return coreEvent.off(channelName, id)
    }
}

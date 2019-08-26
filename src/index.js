let Pawn = require('./pawn')
let Stopper = require('./stopper')
let coreEvent = require('./core_event')

module.exports = {
    pawn(parallel) {
        return new Pawn(parallel)
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

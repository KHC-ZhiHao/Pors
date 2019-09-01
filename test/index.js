const expect = require('chai').expect
const { pawn, pump, stopper, on } = require('../src/index')

describe('#Core', () => {
    it('event', function(done) {
        let count = 0
        on('done', () => {
            count += 1
        })
        let offTest = on('done', () => {
            count += 1
            offTest.off()
        })
        stopper(1)
            .add((done) => {
                done()
            })
            .add((done) => {
                done()
            })
            .start(() => {
                expect(count).to.equal(3)
                done()
            })
    })
})

describe('#Stopper', () => {
    it('normal', function(done) {
        let count = 0
        let total = 0
        let totalLoaded = 0
        let ster = stopper(1)
        ster.on('process', ({ loaded, totalThread }) => {
            total = totalThread
            totalLoaded += loaded
        })
        ster
            .add((done) => {
                count += 1
                done()
            })
            .add((done) => {
                count += 1
                done()
            })
            .start(() => {
                expect(count).to.equal(2)
                done()
            })
        expect(totalLoaded).to.equal(3)
        expect(total).to.equal(2)
    })
    it('real', function(done) {
        let now = Date.now()
        let count = 0
        stopper(2)
            .add((done) => {
                count += 1
                setTimeout(done, 100)
            })
            .add((done) => {
                count += 1
                setTimeout(done, 100)
            })
            .add((done) => {
                count += 1
                setTimeout(done, 100)
            })
            .start(() => {
                let total = Date.now() - now
                expect(count).to.equal(3)
                expect(total < 300).to.equal(true)
                done()
            })
    })
    it('all', function(done) {
        let count = 0
        stopper()
            .add((done) => {
                count += 1
                done()
            })
            .add((done) => {
                count += 1
                done()
            })
            .start(() => {
                expect(count).to.equal(2)
                done()
            })
    })
    it('each', function(done) {
        let count = 0
        stopper(1)
            .each([1, 1, 1, 1, 2], (data, index, done) => {
                count += data + index
                done()
            })
            .start(() => {
                expect(count).to.equal(16)
                done()
            })
    })
    it('error', function(done) {
        let count = 0
        stopper(2)
            .add((done, error) => {
                count += 1
                error('stop')
            })
            .add((done) => {
                setTimeout(() => {
                    count += 1
                    done()
                }, 10)
            })
            .start((message) => {
                expect(count).to.equal(1)
                expect(message).to.equal('stop')
                done()
            })
    })
    it('close', function(done) {
        let count = 0
        stopper(2)
            .add((done, error) => {
                count += 1
            })
            .add((done) => {
                count += 1
            })
            .add((done) => {
                setTimeout(() => {
                    count += 1
                }, 5)
            })
            .start(() => {})
            .close()
        setTimeout(() => {
            expect(count).to.equal(2)
            done()
        }, 10)
    })
})

describe('#Pawn', () => {
    it('normal', function() {
        let count = 0
        pawn()
            .add((done) => {
                count += 1
                done('1234')
            })
            .add((done) => {
                count += 1
                done('1234')
            })
        expect(count).to.equal(2)
    })
    it('real', function(close) {
        let now = Date.now()
        pawn(2)
            .add((done) => {
                setTimeout(() => {
                    done()
                }, 100)
            })
            .add((done) => {
                setTimeout(() => {
                    done()
                }, 100)
            })
            .add((done) => {
                setTimeout(() => {
                    expect((Date.now() - now) < 300).to.equal(true)
                    done()
                    close()
                }, 100)
            })
    })
    it('each', function() {
        let count = 0
        pawn()
            .each([1, 1, 1, 1, 2], (data, index, done) => {
                count += data + index
                done()
            })
        expect(count).to.equal(16)
    })
    it('event', function() {
        let count = 0
        let pw = pawn()
        pw.on('done', (event) => {
            expect(typeof event.type).to.equal('string')
            count += 1
        })
        pw.each([1, 1], (data, index, done) => {
            done()
        })
        expect(count).to.equal(2)
    })
    it('clear', function(done) {
        let count = 0
        pawn(2)
            .add((done) => {
                done()
            })
            .add((done) => {
                done()
            })
            .add((done) => {
                done()
            })
            .clear()
        setTimeout(() => {
            expect(count).to.equal(0)
            done()
        }, 10)
    })
})

describe('#Pump', () => {
    it('test', function(done) {
        let p = pump(done)
        p.add(2)
        p.press()
        p.press()
    })
})

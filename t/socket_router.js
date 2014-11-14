var test = require('tape').test
var mod  = require('../lib/socket_router')
var stream = require('stream')


test('can load module', function (t) {
    var router = mod.create()
    t.ok(router.define, 'ok router.define')
    t.ok(router.route, 'ok router.route')
    t.end()
})

test('can .define, .route', function (t) {
    var router = mod.create()
    router
        .define('error', function (err) {
            this.write(err.message)
        })
        .define('test', function (value) {
            this.write(value)
        })


    var datas = ['Abc', 'Def', new Error('foo'), 'Ghi']
    var spy   = []
    var conn = new stream.Duplex({
        decodeStrings: false
      , objectMode: true
    })
    conn._write = function (data, enc, done) {
        spy.push(data)
        done()
    }
    conn._read = function () {
        this.push(datas.shift() || null)
    }


    conn.on('data', function (mes) {
        if (/^Error/.test(mes)) {
            router.route('error', mes, conn)
        } else {
            router.route('test', mes, conn)
        }
    })

    conn.on('end', function () {
        conn.end()
    })
    conn.on('finish', function () {
        t.deepEqual(spy, ['Abc', 'Def', 'foo', 'Ghi']
          , "spy deepEqual ['Abc', 'Def', 'foo', 'Ghi']")
        t.end()
    })
})

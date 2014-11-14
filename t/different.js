var path   = require('path')
var stream = require('stream')
var test   = require('tape').test
var Level  = require('../lib/level')
var Diff   = require('../lib/different')
var config = {
    db: path.join(__dirname, 'mydb')
  , valueEncoding: 'json'
}

test('can load module', function (t) {
    t.ok(Diff.prototype)
    t.end()
})

var db   = new Level(config)
db.db.del('http://ex001.org/pub/001')


test('new entry', function (t) {
    var entry1 = {
        link: 'http://ex001.org/pub/001'
      , date: new Date(100)
      , title: 'test - 1'
    }
    var data = [
        entry1
    ]
    var ids = data.map(function (ent) {
        return ent.link
    })
    var ss = setup(data)
    var rs = ss.rs
    var ws = ss.ws
    var diff = ss.diff
    var spy = []

    ;[ diff, ws ].forEach(function (writable) {
        writable.on('unpipe', function (readable) {
            if (readable._readableState.ended) return
            readable.pipe(writable)
        })
    })

    rs.on('end', spy.push.bind(spy, 'rs end'))
    diff.on('finish', spy.push.bind(spy, 'diff finish'))
    diff.on('end', spy.push.bind(spy, 'diff end'))
    ws.on('finish', spy.push.bind(spy, 'ws finish'))
    ws.on('finish', function () {
        t.is(ws.spy.length, 1, 'ws.spy.length === 1')
        t.is(ws.spy[0].link, 'http://ex001.org/pub/001', ws.spy[0].link)
        t.is(ws.spy[0].unix, Number(new Date(100)), ws.spy[0].unix)
        t.deepEqual(spy, ['rs end', 'diff finish', 'diff end', 'ws finish']
          , 'rs end -> diff finish -> diff end -> ws finish')
        t.end()
//        teardown(ids)
    })

    rs.pipe(diff).pipe(ws)
})
test('same entry', function (t) {
    var entry1 = {
        link: 'http://ex001.org/pub/001'
      , date: new Date(100)
      , title: 'test - 1'
    }
    var data = [
        entry1
    ]
    var ids = data.map(function (ent) {
        return ent.link
    })
    var ss = setup(data)
    var rs = ss.rs
    var ws = ss.ws
    var diff = ss.diff
    var spy = []

    ;[ diff, ws ].forEach(function (writable) {
        writable.on('unpipe', function (readable) {
            if (readable._readableState.ended) return
            readable.pipe(writable)
        })
    })

    rs.on('end', spy.push.bind(spy, 'rs end'))
    diff.on('finish', spy.push.bind(spy, 'diff finish'))
    diff.on('end', spy.push.bind(spy, 'diff end'))
    ws.on('finish', spy.push.bind(spy, 'ws finish'))
    ws.on('finish', function () {
        t.is(ws.spy.length, 0, 'ws.spy.length === 0')
        t.deepEqual(spy, ['rs end', 'diff finish', 'diff end', 'ws finish']
          , 'rs end -> diff finish -> diff end -> ws finish')
        t.end()
//        teardown(ids)
    })

    rs.pipe(diff).pipe(ws)
})
test('update entry', function (t) {
    var entry1 = {
        link: 'http://ex001.org/pub/001'
      , date: new Date(200)
      , title: 'test - 1.1'
    }
    var data = [
        entry1
    ]
    var ids = data.map(function (ent) {
        return ent.link
    })
    var ss = setup(data)
    var rs = ss.rs
    var ws = ss.ws
    var diff = ss.diff
    var spy = []

    diff.on('error', function (err) {
        console.log(err.stack)
        teardown(ids)
        process.exit(1)
    })

    ;[ diff, ws ].forEach(function (writable) {
        writable.on('unpipe', function (readable) {
            if (readable._readableState.ended) return
            readable.pipe(writable)
        })
    })

    rs.on('end', spy.push.bind(spy, 'rs end'))
    diff.on('finish', spy.push.bind(spy, 'diff finish'))
    diff.on('end', spy.push.bind(spy, 'diff end'))
    ws.on('finish', spy.push.bind(spy, 'ws finish'))
    ws.on('finish', function () {
        t.is(ws.spy.length, 1, 'ws.spy.length === 1')
        t.is(ws.spy[0].link, 'http://ex001.org/pub/001', ws.spy[0].link)
        t.is(ws.spy[0].unix, Number(new Date(200)), ws.spy[0].unix)
        t.deepEqual(spy, ['rs end', 'diff finish', 'diff end', 'ws finish']
          , 'rs end -> diff finish -> diff end -> ws finish')
        t.end()
        teardown(ids)
    })

    rs.pipe(diff).pipe(ws)
})

function setup (src) {
    var rs = createReadable(src)
    var ws = createWritable()
    var diff = new Diff(db)

    return {
        rs:   rs
      , diff: diff
      , ws:   ws
    }
}
function teardown (ids) {
    if (! Array.isArray(ids)) ids = [ids]
    ids.forEach(function (id) {
        db.db.del(id, function (err) {
            err ? console.log(String(err))
                : console.log('db.db.delete %s', id)
        })
    })
}

function createReadable (src) {
    var rs = new stream.Readable({objectMode: true})
    rs.src = src.slice()
    rs._read = function () {
        this.push(this.src.shift() || null)
    }
    return rs
}
function createWritable () {
    var ws = new stream.Writable({objectMode: true})
    ws.spy = []
    ws._write = function (data, enc, done) {
        this.spy.push(data)
        done()
    }
    return ws
}

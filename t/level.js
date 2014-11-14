var path = require('path')
var test = require('tape').test
var Level = require('../lib/level')
var config = {
    db: path.join(__dirname, 'mydb')
  , valueEncoding: 'json'
}

test('can load module', function (t) {
    t.ok(Level.prototype)
    t.end()
})

var db = new Level(config)

function teardown (ids) {
    if (! Array.isArray(ids)) ids = [ids]
    ids.forEach(function (id) {
        db.db.del(id, function (err) {
            err ? console.log(String(err))
                : console.log('db.db.delete %s', id)
        })
    })
}

test('get # no data', function (t) {
    db.get('foo', function (err, data) {
        t.ok(! err, 'no error')
        t.ok(! data, 'no data')
        t.end()
    })
})
test('put -> get', function (t) {
    db.put('foo', 123, function (err) {
        t.ok(! err, 'no error # .put')
        db.get('foo', function (err, data) {
            t.ok(! err, 'no error .get')
            t.ok(data, 'exists data')
            t.is(data.unix, 123, 'data === ' + 123)

            t.end()
            teardown('foo')
        })
    })
})

'use strict'
var levelup  = require('levelup')
var slenderr = require('slenderr')

slenderr.define('config.db not found')

function Level (config) {
    var db
    if ('string' == typeof config) {
        db = config
        config = {}
    } else {
        db = config.db
        delete config.db
    }
    config.valueEncoding = 'utf8'
    this.db = levelup(db, config)
}

Level.prototype.get = function get (id, f) {
    this.db.get(id, function (err, unix) {
        if (err && 'NotFoundError' === err.type)
            //return f(null, {unix: null})
            return f(null, null)

        f(err, {unix: Number(unix)})
    })
}
Level.prototype.put = function (id, unix, f) {
    this.db.put(id, unix, f)
}
module.exports = Level

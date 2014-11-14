'use strict'
var util = require('util')

var router = {}
router.define = function (method, f) {
    this.routes[method] = f
    return this
}
router.route = function (method, value, she) {
    var f = this.routes[method]
    if ('function' !== typeof f) return
    f.apply(she, [value])
}
router.set = function (conn) {
    this.route('connection', null, conn)

    var me = this
    conn.on('error', function (err) {
        me.route('error', err, conn)
    })
    conn.on('close', function () {
        me.route('close', null, conn)
    })
    conn.on('pipe', function (src) {
        me.route('pipe', src, conn)
    })
    conn.on('unpipe', function (src) {
        me.route('unpipe', src, conn)
    })
    conn.on('data', function (mes) {
        var data
        try {
            data = JSON.parse(mes)
        } catch (err) {
            var mes = util.format('JSON.parse Error: %s', err.message)
            return me.route('error', new Error(mes))
        }
        me.route(data.method, data.value, conn)
    })
}

module.exports.create = function create () {
    return Object.create(router, {
        routes: {
            value: {}
        }
    })
}

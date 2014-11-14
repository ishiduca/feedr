'use strict'
var Sock   = require('./socket')

function WrapSock (config, listeners) {
    this.routes = {}
    Sock.call(this, config, listeners)
}
;(function () {
    var F = function () {}
    F.prototype = Sock.prototype
    WrapSock.prototype = new F
    WrapSock.prototype.constructor = WrapSock
})()

WrapSock.prototype.define = function (method, f) {
    if ('function' === typeof f)
        this.routes[method] = f
    return this
}
WrapSock.prototype.route = function (method, value, she) {
    var f = this.routes[method]
    if ('function' !== typeof f) return
    f.apply(she, [value])
}

var listeners = {}
listeners.onopen = function () {
    console.log('[open protocol %s]', this.sock.protocol)
}
listeners.onmessage = function (data) {
    if (data.method && data.value) {
        this.route(data.method, data.value)
        return
    }
    this.route('entry', data)
}

module.exports = function (config) {
    return new WrapSock(config, listeners)
}

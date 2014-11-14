'use strict'
var http = require('http')
var mm   = {}
mm.use = function (name, args) {
    var middleware = require(name)(args)
    'function' === typeof middleware &&
        this.middlewares.push(middleware)
    return this
}
mm.constructor = function constructor () {
    var me = this
    this.server = http.createServer(function (req, res) {
        var cont = {app: me}
        help(0)

        function help (n) {
            var middleware = me.middlewares[n]
            if ('function' !== typeof middleware)
                return help(n + 1)

            middleware.apply(cont, [req, res, function next () { help(n + 1)}])
        }
    })
    return this
}

module.exports.create = function () {
    return Object.create(mm, {
        middlewares: {
            value: []
        }
    }).constructor()
}

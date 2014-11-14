'use strict'
var pack   = require('getpack')()
var sockjs = require('sockjs')
var router = require('socket_router').create()
var api    = require('api')

router.define('connection', api.connection)
router.define('error',      api.error)
router.define('close',      api.close)
router.define('pipe',       api.pipe)
router.define('unpipe',     api.unpipe)
router.define('rebuild',    api.rebuild)

module.exports = function sockjsInstallHandlers (server) {
    var sock = sockjs.createServer({sockjs_url: pack.config.sockjs.src})
    sock.on('connection', router.set.bind(router))
    server.on('upgrade', function (req, res) { res.end() })
    sock.installHandlers(server, {prefix: pack.config.sockjs.prefix})
}

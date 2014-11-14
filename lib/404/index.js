module.exports = function (args) {
    'use strict'

    var responseHeader = Object.keys(args || {}).reduce(function (resheader, prop) {
        resheader[prop] = args[prop]
        return resheader
    }, {
        'content-type': 'text/html; charset=utf-8'
      , 'connection': 'close'
    })

    return function res404 (req, res, next) {
        var mes = '404 not found ' + req.url
        responseHeader['content-length'] = Buffer.byteLength(mes)
        res.writeHead(404, responseHeader)
        res.end(mes)
    }
}

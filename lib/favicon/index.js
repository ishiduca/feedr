'use strict'
var url = require('url')
var fs  = require('fs')

module.exports = function (args) {
    return function favicon (req, res, next) {
        if ('/favicon.ico' !== url.parse(req.url).pathname)
            return next()

        var headers = {'content-type': 'image/x-icon'}
        res.writeHead(200, headers)
        res.end()
    }
}

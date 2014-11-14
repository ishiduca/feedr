var url = require('url')

module.exports = function (args) {
    'use strict'

    return function favicon (req, res, next) {
        if ('/favicon.ico' !== url.parse(req.url).pathname)
            return next()

        res.writeHead(200, {'content-type': 'image/x-icon'})
        res.end()
    }
}

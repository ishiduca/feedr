var url   = require('url')
var fs    = require('fs')
var hogan = require('hogan.js')

module.exports = function (args) {
    'use strict'

    var template = fs.readFileSync(args.template, {encoding: 'utf8'})
    var compiler = hogan.compile(template)

    return function main (req, res, next) {
        if (url.parse(req.url).pathname !== '/')
            return next()

        var index_html = compiler.render(args.config || {})
        res.writeHead(200, {
            'conent-type': 'text/html; charset=utf-8'
          , 'content-length': Buffer.byteLength(index_html)
        })
        res.end(index_html)
    }
}

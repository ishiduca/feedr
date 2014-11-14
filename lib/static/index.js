var path  = require('path')
var url   = require('url')
var filed = require('filed')

module.exports = function (args) {
    'use strict'

    var root = args.root
    var dirs = args.dirs || []

    return function sendStatic (req, res, next) {
        var pathname = url.parse(req.url).pathname
        for (var i = 0, len = dirs.length; i < len; i++) {
            var dir = dirs[i] + '/'
            if (dir === pathname.slice(0, dir.length)) {
                filed(path.join(root, pathname)).pipe(res)
                return
            }
        }

        next()
    }
}

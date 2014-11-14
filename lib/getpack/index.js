'use strict'
var fs   = require('fs')
var path = require('path')
module.exports = function getpack () {

    return get(process.argv[1] || process.cwd())

    function get (cwd) {
        var pack = path.join(cwd, 'package.json')
        if (fs.existsSync(pack)) {
            var pack = require(pack)
            pack.dir = cwd
            return pack
        }

        if (-1 === cwd.indexOf(process.env.HOME))
            return null

        return get(path.join(cwd, '..'))
    }
}

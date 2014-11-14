'use strict'
var stream = require('stream')
var util   = require('util')
var fs     = require('fs')
util.inherits(IgnoreFilter, stream.Transform)

function IgnoreFilter (ignore_txt) {
    stream.Transform.call(this)
    this._writableState.objectMode = true
    this._readableState.objectMode = false

    var ignores
    if (ignore_txt && 'object' === typeof ignore_txt)
        ignores = ignore_txt

    if ('string' === typeof ignore_txt) {
        var ignores = fs.readFileSync(ignore_txt, {encoding: 'utf8'})
                        .split('\n').filter(Boolean)
    }

    if (Array.isArray(ignores)) {
        ignores = ignores.reduce(function (ignores, uri) {
            ignores[uri] = true
            return ignores
        }, {})
    }

    this.ignores = ignores || {}
}

IgnoreFilter.prototype._transform = function (outline, enc, done) {
    if (! outline || ! outline.xmlurl) return done()
    if (! this.ignores[outline.xmlurl]) this.push(outline.xmlurl)
    done()
}

module.exports = IgnoreFilter

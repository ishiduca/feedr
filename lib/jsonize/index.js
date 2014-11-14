'use strict'
var stream = require('stream')
var util   = require('util')
util.inherits(JSONize, stream.Transform)

function JSONize () {
    stream.Transform.call(this)
    this._writableState.objectMode = true
    this._readableState.decodeStrings = false
}
JSONize.prototype._transform = function (o, enc, done) {
    var json
    try {
        json = JSON.stringify(o)
    } catch (err) {
        return done(err)
    }
    this.push(json)
    done()
}

module.exports = JSONize

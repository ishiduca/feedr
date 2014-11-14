'use strict'
var util = require('util')
var ansi = require('ansi-color')

// var clog = require('clog')
// var red = clog().color('red').out(console.log.bind(console)).bind()
// red('[%s]', 'foo')

var clog = {}
clog.color = function (color) {
    this.color_ = color
    return this
}
clog.out = function (out) {
    this.out_ = out
    return this
}
clog.puts = function () {
    var str = util.format.apply(util, arguments)
    return this.out_ ? this.out_(ansi.set(str, this.color_)) : str
}
clog.bind = function () {
    var me = this
    return function puts () {
        me.puts.apply(me, arguments)
    }
}

module.exports = function create () {
	return Object.create(clog)
}

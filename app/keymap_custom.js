'use strict'

var Keymap = require('./keymap').Keymap

function KeymapCustom (target) {
    Keymap.call(this, target)
    this.helpStrs = {}
}

var F = function () {}
F.prototype = Keymap.prototype
KeymapCustom.prototype = new F
KeymapCustom.prototype.constructor = KeymapCustom

KeymapCustom.prototype.on = function (chas, helpStr, listener) {
    var me = this
    if ('string' === typeof chas) chas = [ chas ]
    chas.forEach(function (cha) {
        me.helpStrs[cha] = helpStr    
    })

    Keymap.prototype.on.apply(this, [chas, listener])

    return this
}
KeymapCustom.prototype.help = function (cha) {
	return this.helpStrs[cha] || '"' + cha + '" not registered'
}
KeymapCustom.prototype.registers = function () {
	return Object.keys(this.listeners)
}

module.exports = function keymapCustom (target) {
    return new KeymapCustom(target)
}
module.exports.KeymapCustom = KeymapCustom
module.exports.Keymap       = Keymap

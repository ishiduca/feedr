'use strict'
var Combo = require('combokeys')
function Keymap (element) {
    var c = new Combo(element)
    for (var prop in c) {
        if (c.hasOwnProperty(prop))
            this[prop] = c[prop]
    }
    this.helpStrs = {}
}
;(function () {
    var F = function () {}
    F.prototype = Combo.prototype
    Keymap.prototype = new F
    Keymap.prototype.constructor = Keymap
})()

Keymap.prototype.on = function (keys, help, cb, act) {
    this.bind(keys, cb, act)

    var me = this
    ;('[object Array]' === ({}).toString.apply(keys) ? keys : [ keys ])
    .forEach(function (key) {
        me.helpStrs[key] = help
    })
    return this
}

module.exports = function create (target) {
    return new Keymap(target || document)
}

//var Keymap = require('./keymap').Keymap
//
//function KeymapCustom (target) {
//    Keymap.call(this, target)
//    this.helpStrs = {}
//}
//
//var F = function () {}
//F.prototype = Keymap.prototype
//KeymapCustom.prototype = new F
//KeymapCustom.prototype.constructor = KeymapCustom
//
//KeymapCustom.prototype.on = function (chas, helpStr, listener) {
//    var me = this
//    if ('string' === typeof chas) chas = [ chas ]
//    chas.forEach(function (cha) {
//        me.helpStrs[cha] = helpStr    
//    })
//
//    Keymap.prototype.on.apply(this, [chas, listener])
//
//    return this
//}
//KeymapCustom.prototype.help = function (cha) {
//    return this.helpStrs[cha] || '"' + cha + '" not registered'
//}
//KeymapCustom.prototype.registers = function () {
//    return Object.keys(this.listeners)
//}
//
//module.exports = function keymapCustom (target) {
//    return new KeymapCustom(target)
//}
//module.exports.KeymapCustom = KeymapCustom
//module.exports.Keymap       = Keymap

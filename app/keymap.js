'use strict'
function map (a, b, c) {
    for (; a <= b; a++) {
        charMap[a] = String.fromCharCode(a+c)
    }
}

var charMap = {
    8:  'black'
  , 9:  'tab'
  , 13: 'enter'
  , 16: 'shift'
  , 17: 'ctrl'
  , 46: 'delete'
}

map(65, 90, 32)
map(48, 57, 0)
map(96, 105, -48)

;('space pageup pagedown end home left up right down').split(' ')
.forEach(function (cha, i) {
	charMap[(32 + i)] = cha
})

function Keymap (target) {
    this.target    = target || document
    this.listeners = {}

    var me = this

    this.target.onkeydown = function (ev) {
        var tgt = (ev.target || ev.srcElement).tagName.toLowerCase()
        if ('input' === tgt || 'textarea' === tgt) return null

        var keychar = charMap[ev.keyCode]
        if (ev.shiftKey && keychar && 1 === keychar.length)
            keychar = keychar.toUpperCase()

        if (ev.ctrlKey)
            keychar = 'C' + keychar

        ;(me.listeners[keychar] || []).forEach(function (listener, i) {
            'function' === typeof listener && listener.call(me.target, ev)
        })
    }
}

Keymap.prototype.on = function on (chas, listener) {
    if ('string' === typeof chas) chas = [chas]

    var me = this
    chas.forEach(function (cha) {
        ;(me.listeners[cha] || (me.listeners[cha] = [])).push(listener)
    })

    return this
}

module.exports = function keymap (target) {
    return new Keymap(target)
}
module.exports.Keymap = Keymap
module.exports.charMap = charMap
module.exports.convert = function (keyCode) {
    return charMap[keyCode] || null
}

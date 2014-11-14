'use strict'

var slenderr = require('slenderr')

function Sock (config, events) {
    this.config = config
    this.events = events
    this.resetMax = config.resetMax || 5
    this.resetNow = 0
    this.resetInterval = config.resetInterval || 1000

    this.init()
}

slenderr.define.call(Sock, 'sock reset max')

Sock.prototype.init = function () {
    if ((this.resetNow += 1) > this.resetMax)
        throw new Sock.SockResetMaxError('can reset time "' + this.resetMax + '"')

    var sock = this.sock = new SockJS(this.config.sockjs_url)
    var me   = this

    if ('function' !== typeof me.events.onerror) {
        me.events.onerror = function onerror (err) {
            console.log(err.stack || String(err))
        }
    }

    sock.onclose = function () {
        'function' === typeof me.events.onclose &&
            me.events.onclose.apply(me, arguments)

        setTimeout(function () {
            try {
                me.init()
            } catch (err) {
                console.log(err.stack)
            }
        }, me.resetInterval)
    }
    sock.onmessage = function (ev) {
        if ('function' !== typeof me.events.onmessage)
            return console.log('not register "onmessage" listener')

        var data
        try {
            data = JSON.parse(ev.data)
        } catch (err) {
            return me.events.onerror.apply(me, [err])
        }
        me.events.onmessage.apply(me, [data])
    }

    ;('onopen onerror').split(' ').forEach(function (listener) {
        if ('function' === typeof me.events[listener]) {
            sock[listener] = function () {
                me.events[listener].apply(me, arguments)
            }
        }
    })
}

Sock.prototype.close = function () {
    this.sock.close()
}
Sock.prototype.send = function (mes) {
    var data
    if ('string' === typeof mes) data = {value: mes}

    try {
        this.sock.send(JSON.stringify(data || mes))
    } catch (err) {
        console.log(err.stack)
    }
}

module.exports = Sock

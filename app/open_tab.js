'use strict'
module.exports = function openTab (feeds) {
    return function (ev) {
        var a = document.createElement('a')
        a.href = feeds.currentEntry().link
        a.target = '_blank'
        var ev = document.createEvent('MouseEvents')
        if (/chrome/.test(window.navigator.userAgent.toLowerCase()))
            ev.initMouseEvent('click', true, true, window, 0, 0, 0, 0, false, false, false, false, 1, null)
        else
            ev.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)

        a.dispatchEvent(ev)
    }
}

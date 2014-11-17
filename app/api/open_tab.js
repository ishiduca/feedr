'use strict'
module.exports = function openTab (m) {
	return function (ev) {
        var a    = document.createElement('a')
        a.href   = m.current().currentEntry().link
        a.target = '_blank'

        var evnt = document.createEvent('MouseEvents')
        if (/chrome/.test(window.navigator.userAgent.toLowerCase()))
            evnt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, false, false, false, false, 1, null)
        else
            evnt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)

        a.dispatchEvent(evnt)
	}
}

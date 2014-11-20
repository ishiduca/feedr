'use strict'
function Feeds () {
    this.feeds    = [].slice.apply(arguments)
    this.selected = this.feeds[0]
}

Feeds.prototype.current = function () {
    return this.selected
}
Feeds.prototype.change = function () {
    var len = this.feeds.length
    var now = indexOf(this.feeds, this.selected)
    var next = (now + 1) % len
    this.selected = this.feeds[next]
}

var Feed = require('./feed')
for (var prop in Feed.prototype) {
    var FeedHasOwn   = Feed.prototype.hasOwnProperty(prop)
    var FeedFunc     = 'function' === typeof Feed.prototype[prop]
    var FeedsNotFunc = 'function' !== typeof Feeds.prototype[prop]
    if (FeedHasOwn && FeedFunc && FeedsNotFunc) {
        Feeds.prototype[prop] = function (prop) {
            return function () {
                return this.selected[prop].apply(this.selected, arguments)
            }
        }(prop)
    }
}

module.exports = Feeds

function indexOf (arry, target) {
    if (arry.indexOf) return arry.indexOf(target)
    for (var i = 0, len = arry.length; i < len; i++) {
        if (target === arry[i]) return i
    }
    return -1
}

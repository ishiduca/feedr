'use strict'
var Ractive = require('ractive')
var Feed  = require('./model/feed')
var Feeds = require('./model/feeds')

function onError (err) {
    console.log(err.stack || String(err))
}

var grepLength = 3

var ract = new Ractive({
    el: '#main'
  , template: require('../view/main.html')
})

var unread = new Feed('Unread')
var favs   = new Feed('Pin')
var feeds  = new Feeds(unread, favs)

module.exports.open_tab = require('./open_tab')(feeds)
module.exports.entry = function (entry) {
    unread.push(entry, function (err) {
        if (err) return onError(err)

        var c = feeds.current()
        ract.set('pointer', pointer(c))
        ract.set('feedlist', c.grepFeeds(grepLength))
        if (! ract.get('current')) ract.set('current',  c.getCurrentEntry())
    })
}
module.exports.pin = function () {
    var c = feeds.current()
    var entry = c.getCurrentEntry()
    favs.exists(entry, function (err, exists) {
        exists ? favs.del(entry, done)//favs.shift(entry, done)
               : favs.push(entry, done)
    })
    function done (err) {
        if (err) return onError(err)
        help.apply(c)
    }
}
module.exports.changeMode = function () {
    feeds.change()
    help.apply(feeds.current(), [true])
}
module.exports.nextEntry = function () {
    var c = feeds.current()
    c.nextEntry()
    help.apply(c)
}
module.exports.prevEntry = function () {
    var c = feeds.current()
    c.prevEntry()
    help.apply(c)
}
module.exports.nextFeed = function () {
    var c = feeds.current()
    c.nextFeed()
    help.apply(c, [true])
}
module.exports.prevFeed = function () {
    var c = feeds.current()
    c.prevFeed()
    help.apply(c, [true])
}

function help (requireFeedList) {
    var me = this
    var entry = this.getCurrentEntry()
    favs.exists(entry, function (err, exists) {
        entry.isPin = !! exists
        ract.set('pointer', pointer(me))
        requireFeedList && ract.set('feedlist', me.grepFeeds(grepLength))
        ract.set('current', entry)
        unread.del(entry, function (err) {
            if (err) return onError(err)
        })
    })
}

function pointer (c) {
    var p = {}
    ;('countCurrentEntries countFeeds posCurrentEntry posFeed').split(' ')
    .forEach(function (name) {
        p[name] = c[name]()
    })
    return p
}

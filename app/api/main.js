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

        ract.set('pointer', pointer(feeds))
        ract.set('feedlist', feeds.grepFeeds(grepLength))
        if (! ract.get('current')) ract.set('current', feeds.getCurrentEntry())
    })
}
module.exports.pin = function () {
    var entry = feeds.getCurrentEntry()
    favs.exists(entry, function (err, exists) {
        exists ? favs.del(entry, done) //favs.shift(entry, done)
               : favs.push(entry, done)
    })
    function done (err) {
        if (err) return onError(err)
        help.apply(feeds)
    }
}
module.exports.changeMode = function () {
    feeds.change()
    help.apply(feeds, [true])
}
module.exports.nextEntry = function () {
    feeds.nextEntry()
    help.apply(feeds)
}
module.exports.prevEntry = function () {
    feeds.prevEntry()
    help.apply(feeds)
}
module.exports.nextFeed = function () {
    feeds.nextFeed()
    help.apply(feeds, [true])
}
module.exports.prevFeed = function () {
    feeds.prevFeed()
    help.apply(feeds, [true])
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
    ;('countCurrentEntries countFeeds posCurrentEntry posFeed').split(' ').forEach(function (name) {
        p[name] = c[name]()
    })
    return p
}

'use strict'
function FeedHandler () {
    this.feeds = {}
    this.feedIndex = []
    this.cursorInit()
}
FeedHandler.prototype.cursorInit = function () {
    this.cursor = {
        entry: 0
      , feed: 0
    }
    return this
}
FeedHandler.prototype.push = function (entry) {
    var xmlurl = entry.xmlurl
    if (! this.feeds[xmlurl]) {
        this.feeds[xmlurl] = []
        this.feedIndex.push(xmlurl)
    }

    for (var i = 0, len = this.feeds[xmlurl].length; i < len; i++) {
        var ent = this.feeds[xmlurl][i]
        if (ent.link === entry.link) return this
    }
    this.feeds[xmlurl].push(entry)

    return this
}
FeedHandler.prototype.shift = function (entry) {
    var id = entry.link
    for (var xmlurl in this.feeds) {
        var feed = this.feeds[ xmlurl ]
        for (var i = 0, len = feed.length; i < len; i++) {
            if (feed[i].link === id) {
                this.feeds[xmlurl].splice(i, 1)
                return true
            }
        }
    }
    return false
}
FeedHandler.prototype.getCurrentFeed  = function () {
    var index = this.feedIndex[this.cursor.feed]
    return index ? this.feeds[ this.feedIndex[this.cursor.feed] ] : []
}
FeedHandler.prototype.getCurrentEntry = function () {
    var feed = this.getCurrentFeed()
    return feed[this.cursor.entry] || []
}
FeedHandler.prototype.countFeeds = function () {
    return this.feedIndex.length
}
FeedHandler.prototype.countCurrentEntries = function () {
    var feed = this.getCurrentFeed()
    return feed.length
}
FeedHandler.prototype.posFeed = function () {
    return this.cursor.feed
}
FeedHandler.prototype.posCurrentEntry = function () {
    return this.cursor.entry
}
FeedHandler.prototype.changeFeed = function changeFeed (n) {
    var next = this.cursor.feed + n
    var len  = this.feedIndex.length
    if (next < 0) next = len - 1
    this.cursor = {
        entry: 0
      , feed: next % len
    }
    return this
}
FeedHandler.prototype.nextFeed = function () {
    this.changeFeed(1)
    return this
}
FeedHandler.prototype.prevFeed = function () {
    this.changeFeed(-1)
    return this
}
FeedHandler.prototype.changeEntry = function changeEntry (n) {
    var len  = this.countCurrentEntries()
    var next = this.cursor.entry + n
    if (next < 0) next = len - 1
    this.cursor.entry = next % len
    return this
}
FeedHandler.prototype.nextEntry = function () {
    this.changeEntry(1)
    return this
}
FeedHandler.prototype.prevEntry = function () {
    this.changeEntry(-1)
    return this
}
FeedHandler.prototype.grepFeeds = function (n) {
    var me = this
    if ((!(n > 0)) || this.feedIndex.length < n)
        return allList()

    var greped = []
    var cursor = this.cursor.feed
    var len    = this.feedIndex.length
    for (var i = 0; i < n; i++) {
        var index = cursor + i - 1
        if (index < 0) index = len - 1
        greped.push(map(this.feedIndex[index % len]))
    }

    return greped

    function allList () {
        return me.feedIndex.map(map)
    }
    function map (xmlurl) {
        var entry = me.feeds[xmlurl][0]
        var meta  = entry.meta
        return (meta && meta.title) ? meta.title :
               (meta && meta.link)  ? meta.link  : xmlurl
    }
}
//FeedHandler.prototype.grepEntries = function (n) {
//    var me = this
//    var feed = this.getCurrentFeed()
//    var len  = this.countCurrentEntries()
//
//    if ((!(n > 0)) || len < n)
//        return allList()
//
//    var greped = []
//    var cursor = this.cursor.entry
//    for (var i = 0; i < n; i++) {
//        var index = cursor + i - 1
//        if (index < 0) index = len - 1
//        greped.push(map(feed[index % len]))
//    }
//    return greped
//
//    function allList () {
//        return feed.map(map)
//    }
//    function map (entry) {
//        return entry.title || entry.link || 'no title'
//    }
//}

module.exports = FeedHandler

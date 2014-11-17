'use strict'

function Feeds () {
    this.feedList = {}
    this.feedIndexList = []
}
//feeds.currentEntryIndex  // @number : entry index in current feed
//feeds.currentFeedIndex   // @number : feed index in all feeds
//feeds.feedList      = {} // @hash : { xmlurl : [ entry, ... ] }
//feeds.feedIndexList = [] // @arry : [ xmlurl, ... ]

Feeds.prototype.currentFeed = function () {
   return this.feedList[ this.feedIndexList[ this.currentFeedIndex ] ]
}
Feeds.prototype.currentEntry = function () {
    var currentFeed = this.currentFeed()
    return currentFeed[this.currentEntryIndex]
}

Feeds.prototype.pushEntry = function (entry) {
    if (0 === this.feedIndexList.length) {
        this.currentFeedIndex  = 0
        this.currentEntryIndex = 0
    }

    var id = entry.xmlurl
    if (! this.feedList[id]) {
        this.feedList[id] = []
        this.feedIndexList.push(id)
    }
    this.feedList[id].push(entry)

    return this
}

Feeds.prototype.countFeeds = function () {
    return this.feedIndexList.length
}
Feeds.prototype.countCurrentEntries = function () {
    return this.currentFeed().length
}
Feeds.prototype.posFeed = function () {
    return this.currentFeedIndex
}
Feeds.prototype.posCurrentEntry = function () {
    return this.currentEntryIndex
}

function changeFeed (n) {
    var next = this.currentFeedIndex + n
    if (next < 0) next = this.feedIndexList.length - 1
    this.currentFeedIndex  = next % this.feedIndexList.length
    this.currentEntryIndex = 0
}

Feeds.prototype.nextFeed = function () {
    changeFeed.apply(this, [1])
    return this
}
Feeds.prototype.prevFeed = function () {
    changeFeed.apply(this, [-1])
    return this
}

function changeEntry (n) {
    var next = this.currentEntryIndex + n
    var currentFeed = this.currentFeed()
    if (next < 0) next = currentFeed.length - 1
    this.currentEntryIndex = next % currentFeed.length
}

Feeds.prototype.nextEntry = function () {
    changeEntry.apply(this, [1])
    return this
}
Feeds.prototype.prevEntry = function () {
    changeEntry.apply(this, [-1])
    return this
}

Feeds.prototype.grepFeedIndexList = function (len) {
    var me = this

    if (!(len > 0)) return allList()
    if (this.feedIndexList.length < len)
        return allList()

    function map (feed) {
        var firstEntry = feed[0]
        var meta = firstEntry.meta
        return (meta && meta.title) ? meta.title :
               (meta && meta.link)  ? meta.link  : firstEntry.xmlurl
    }

    function allList () {
        return me.feedIndexList.map(function (id) {
            return map(me.feedList[id])
        })
    }

    var grepFeeds = []
    for (var i = -1; i < len - 1; i++) {
        var index = (this.currentFeedIndex + i) % this.feedIndexList.length
        if (index < 0) index = this.feedIndexList.length - 1
        grepFeeds.push(map(this.feedList[ this.feedIndexList[index] ]))
    }

    return grepFeeds
}

Feeds.prototype.grepEntriesIndexList = function (len) {
    var me = this
    var currentFeed = this.currentFeed()

    if (!(len > 0)) return allList()
    if (currentFeed.length < len)
        return allList()

    function map (entry) {
        return entry.title || entry.link || 'none'
    }

    function allList () {
        return currentFeed.map(map)
    }

    var pos = this.posCurrentEntry()
    var grepEntries = []
    for (var i = -1; i < len - 1; i++) {
        var index = (pos + i) % currentFeed.length
        if (index < 0) index = currentFeed.length - 1
        grepEntries.push(map(currentFeed[index]))
    }

    return grepEntries
}

module.exports = Feeds

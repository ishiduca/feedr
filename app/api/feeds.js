'use strict'
module.exports = function (db, feeds, ract) {
    return {
        nextFeed:  nextFeed
      , prevFeed:  prevFeed
      , nextEntry: nextEntry
      , prevEntry: prevEntry
      , entry:     entry
    }

    function nextFeed () {
        feeds.nextFeed()
        help(1)
    }

    function prevFeed () {
        feeds.prevFeed()
        help(1)
    }

    function nextEntry () {
        feeds.nextEntry()
        help()
    }

    function prevEntry () {
        feeds.prevEntry()
        help()
    }

    function entry (ent) {
        feeds.pushEntry(ent)
        ract.set('pointer', pointer())
        ract.set('feedlist', feeds.grepFeedIndexList(3))

        if (! ract.get('current')) applyPin()
    }

    function help (requireFeedlist) {
        ract.set('pointer', pointer())
        requireFeedlist && ract.set('feedlist', feeds.grepFeedIndexList(3))
        applyPin()
    }

    function applyPin () {
        var current = feeds.currentEntry()
        db.get(current.link, function (err, ent) {
            current.isPin = !! ent
            ract.set('current', current)
        })
    }

    function pointer () {
        var p = {}
        ;('countCurrentEntries countFeeds posCurrentEntry posFeed')
          .split(' ').forEach(function (name) {
              p[name] = feeds[name]()
          })
        return p
    }
}

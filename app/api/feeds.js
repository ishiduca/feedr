'use strict'
module.exports = function (m, db, ract) {
    return {
        nextFeed:   nextFeed
      , prevFeed:   prevFeed
      , nextEntry:  nextEntry
      , prevEntry:  prevEntry
      , entry:      entry
      , changeMode: changeMode
    }

    function nextFeed () {
        m.current().nextFeed()
        help(1)
    }

    function prevFeed () {
        m.current().prevFeed()
        help(1)
    }

    function nextEntry () {
        m.current().nextEntry()
        help()
    }

    function prevEntry () {
        m.current().prevEntry()
        help()
    }

    function entry (ent) {
        var feeds = m.modes[0]
        feeds.pushEntry(ent)
        ract.set('pointer', pointer())
        ract.set('feedlist', m.current().grepFeedIndexList(3))

        if (! ract.get('current')) applyPin()
    }

    function changeMode () {
        m.changeMode()

        help(1)
    }

    function help (requireFeedlist) {
        ract.set('pointer', pointer())
        requireFeedlist && ract.set('feedlist', m.current().grepFeedIndexList(3))
        applyPin()
    }

    function applyPin () {
        var current = m.current().currentEntry()
        db.get(current.link, function (err, ent) {
            current.isPin = !! ent
            ract.set('current', current)
        })
    }

    function pointer () {
        var p = {}
        ;('countCurrentEntries countFeeds posCurrentEntry posFeed').split(' ').forEach(function (name) {
              p[name] = m.current()[name]()
          })
        return p
    }
}

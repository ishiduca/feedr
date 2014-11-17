'use strict'
var Feeds = require('../model').Feeds

module.exports = function (m, db, ract) {
    return function (ev) {
        var entry = m.current().currentEntry()
        if (! entry) return onError(new Error('"entry" not found'))

        var id = entry.link
        if (! id) return onError(new Error('"entry.link" not found'))

        db.get(id, function (err, _entry) {
            if (err && 'NotFoundError' !== err.type) onError(err)

            ;(_entry) ? del() : put()
        })

        function del () {
            db.del(id, function (err) {
                entry.isPin = false
                ract.set('current', entry)
                resetFavs()
                if (err) onError(err)
            })
        }

        function put () {
            db.put(id, entry, function (err) {
                entry.isPin = true
                ract.set('current', entry)
                resetFavs()
                if (err) onError(err)
            })
        }

        function onError (err) {
            console.log(err.stack)
        }

        function resetFavs () {
            m.modes[1] = new Feeds
            db.createValueStream().on('data', function (entry) {
                m.modes[1].pushEntry(entry)
            })
        }
    }
}

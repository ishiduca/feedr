'use strict'
module.exports = function (db, feeds, ract) {
    return function () {
        var entry = feeds.currentEntry()
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
                if (err) onError(err)
            })
        }

        function put () {
            db.put(id, entry, function (err) {
                entry.isPin = true
                ract.set('current', entry)
                if (err) onError(err)
            })
        }

        function onError (err) {
            console.log(err.stack)
        }
    }
}

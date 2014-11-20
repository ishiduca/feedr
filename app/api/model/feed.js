'use strict'
var FeedHandler  = require('./feed-handler')
var levelup      = require('levelup')
var localstorage = require('localstorage-down')

function Feed (name) {
    if (! name) throw new Error('1st argument "name" not found')
    this.name = name
    this.feed = new FeedHandler
    this.db   = levelup(name, {
        db: localstorage
      , valueEncoding: 'json'
    })

    var me = this

    this.db.createValueStream()
    .on('data', function (entry) {
        me.feed.push(entry)
    })
    .on('end', function () {
        me.feed.cursorInit()
    })
}

Feed.prototype.push = function (entry, done) {
    var me = this
    this.exists(entry, function (err, exists) {
        if (err) return done(err)
        if (exists) return done(null)
        me.db.put(entry.link, entry, function (err) {
            if (! err) me.feed.push(entry)
            done(err)
        })
    })
}
//Feed.prototype.shift = function (entry, done) {
//    var me = this
//    var id = entry.link
//    if (! id) return done(new Error('"entry.link" not found - ' + entry.xmlurl))
//
//    this.db.del(id, function (err) {
//        if (err) return done(err)
//        me.feed.shift(entry)
//        done(null)
//    })
//}
Feed.prototype.del = function (entry, done) {
    var me = this
    var id = entry.link
    if (! id) return done(new Error('"entry.link" not found - ' + entry.xmlurl))

    this.db.del(id, function (err) {
        if (err) return done(err)
        done(null)
    })
}
Feed.prototype.shift = function (entry, done) {
	var me = this
	this.del(entry, function (err) {
		if (err) return done(err)
		me.feed.shift(entry)
		done(null)
	})
}
Feed.prototype.exists = function (entry, done) {
    var me = this
    var id = entry.link
    if (! id) return done(new Error('"entry.link" not found - ' + entry.xmlurl))

    this.db.get(id, function (err, ent) {
        if (err && 'NotFoundError' !== err.type) return done(err)
        done(null, !! ent)
    })
}
for (var prop in FeedHandler.prototype) {
    var HandlerHasOwn = FeedHandler.prototype.hasOwnProperty(prop)
    var HandlerFunc   = 'function' === typeof FeedHandler.prototype[prop]
    var FeedNotFunc   = 'function' !== typeof Feed.prototype[prop]
    if (HandlerHasOwn && HandlerFunc && FeedNotFunc) {
        Feed.prototype[prop] = function (prop) {
            return function () {
                return this.feed[prop].apply(this.feed, arguments)
            }
        }(prop)
    }
}
module.exports = Feed

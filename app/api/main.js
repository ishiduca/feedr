'use strict'
var Ractive = require('ractive')
var levelup = require('levelup')
var localstorage = require('localstorage-down')
var Feeds   = require('../model').Feeds

var ract = new Ractive({
    el: '#main'
  , template: require('../view/main.html')
})

var db = levelup('Pin', {
    db: localstorage
  , valueEncoding: 'json'
})

var feeds = new Feeds
var favs  = new Feeds

var m = {
    currentIndex: 0
  , modes: [feeds, favs]
  , current: function () {
        return this.modes[ this.currentIndex ]
    }
  , changeMode: function () {
        var len = this.modes.length
        this.currentIndex = (this.currentIndex + 1) % len
    }
}

var ctrl = require('./feeds')(m, db, ract)

module.exports.open_tab   = require('./open_tab')(m)
module.exports.pin        = require('./pin')(m, db, ract)

module.exports.entry      = ctrl.entry
module.exports.nextEntry  = ctrl.nextEntry
module.exports.prevEntry  = ctrl.prevEntry
module.exports.nextFeed   = ctrl.nextFeed
module.exports.prevFeed   = ctrl.prevFeed
module.exports.changeMode = ctrl.changeMode

db.createValueStream().on('data', function (entry) {
    favs.pushEntry(entry)
})

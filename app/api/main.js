'use strict'
var Ractive = require('ractive')
var levelup = require('levelup')
var localstorage = require('localstorage-down')

var ract = new Ractive({
    el: '#main'
  , template: require('../view/main.html')
})

var db = levelup('Pin', {
    db: localstorage
  , valueEncoding: 'json'
})

var feeds = require('../model').feeds
module.exports.open_tab  = require('./open_tab')(feeds)
module.exports.pin       = require('./pin')(db, feeds, ract)

var ctrl  = require('./feeds')(db, feeds, ract)
module.exports.entry     = ctrl.entry
module.exports.nextEntry = ctrl.nextEntry
module.exports.prevEntry = ctrl.prevEntry
module.exports.nextFeed  = ctrl.nextFeed
module.exports.prevFeed  = ctrl.prevFeed

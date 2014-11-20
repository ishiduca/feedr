var test  = require('tape').test
var Feed  = require('../api/model/feed')
var Feeds = require('../api/model/feeds')

test('can use module', function (t) {
    t.ok(Feeds.prototype.current, 'ok Feeds')
    t.end()
})

test('new Feeds(feeds, feeds, ..)', function (t) {
    var favs   = {name: 'Pin'}
    var unread = {name: 'Unread'}
    var feeds = new Feeds(unread, favs)

    t.deepEqual(feeds.feeds, [unread, favs], 'feeds.feeds deepEqual [unread, favs]')
    t.is(feeds.selected,  unread, 'feeds.selected === unread')
    t.is(feeds.current(), unread, 'feeds.current() === unread')

    console.log('feeds.change()')
    feeds.change()
    t.is(feeds.current(), favs, 'feeds.current() === favs')
    console.log('feeds.change()')
    feeds.change()
    t.is(feeds.current(), unread, 'feeds.current() === unread')

    t.end()
})

test('composite', function (t) {
    var fav    = new Feed('Pin')
    var feeds  = new Feeds(fav)

    t.is('function', typeof feeds.del)
    t.end()
})

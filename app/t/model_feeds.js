var test = require('tape').test
var api  = require('../model')

test('can use api.feeds', function (t) {
    t.ok(api.feeds.feedIndexList, 'ok api.feeds.feedIndexList')
    t.end()
})

test('.pushEntry(entry): 最初に送られてきたentryを初期化 && リストに取り込めるか'
, function (t) {
    var api = setup()
    var entries = [ { xmlurl: '000'
                    , title: '000 title'
                    , link:  'http://000.net/link'
    } ]

    api.pushEntry(entries[0])
    t.is(api.currentEntry(), entries[0], 'api.currentEntry() === entry')
    t.is(api.posCurrentEntry(), 0, 'api.posCurrentEntry() === 0 # 最初')
    t.is(api.posFeed(), 0, 'api.posFeed() === 0 # 最初')

    t.test('エントリーを１つ登録した時点で移動を試みる', function (t) {
        api.nextEntry()
        t.is(api.posCurrentEntry(), 0, 'api.nextEntry() :これしかないので移動しない')

        api.prevEntry()
        t.is(api.posCurrentEntry(), 0, 'api.prevEntry() :これしかないので移動しない')

        api.nextFeed()
        t.is(api.posFeed(), 0, 'api.nextFeed() :これしかないので移動しない')

        api.prevFeed()
        t.is(api.posFeed(), 0, 'api.prevFeed() :これしかないので移動しない')

        t.end()
    })

    t.end()
})

test('.nextEntry(), .prevEntry() : currentEntryの移動', function (t) {
    var api = setup()
    var entries = [
        { xmlurl: '000'
        , title: '000 title 0'
        , link:  'http://000.net/link/0'
        }
     ,  { xmlurl: '000'
        , title: '000 title 1'
        , link:  'http://000.net/link/1'
        }
     ,  { xmlurl: '000'
        , title: '000 title 2'
        , link:  'http://000.net/link/2'
        }
    ]

    entries.forEach(function (entry) {
        api.pushEntry(entry)
    })

    t.is(api.countFeeds(), 1, 'api.countFeeds() === 1 # ')
    t.is(api.countCurrentEntries(), 3, 'api.countCurrentEntries() === 3')

    t.test('.nextEntry()', function (t) {
        api.nextEntry()
        t.is(api.currentEntry(), entries[1], 'api.nextEntry() # api.currentEntry() === entries[1]')
        t.is(api.posCurrentEntry(), 1, 'api.posCurrentEntry() === 1')
        api.nextEntry()
        t.is(api.currentEntry(), entries[2], 'api.nextEntry() # api.currentEntry() === entries[2]')
        t.is(api.posCurrentEntry(), 2, 'api.posCurrentEntry() === 2')
        api.nextEntry()
        t.is(api.currentEntry(), entries[0], 'api.nextEntry() # api.currentEntry() === entries[0]')
        t.is(api.posCurrentEntry(), 0, 'api.posCurrentEntry() === 0')
        api.nextEntry()
        t.is(api.currentEntry(), entries[1], 'api.nextEntry() # api.currentEntry() === entries[1]')
        t.is(api.posCurrentEntry(), 1, 'api.posCurrentEntry() === 1')
        t.end()
    })

    t.test('.prevEntry()', function (t) {
        api.prevEntry()
        t.is(api.currentEntry(), entries[0], 'api.prevEntry() # api.currentEntry() === entries[0]')
        t.is(api.posCurrentEntry(), 0, 'api.posCurrentEntry() === 0')
        api.prevEntry()
        t.is(api.currentEntry(), entries[2], 'api.prevEntry() # api.currentEntry() === entries[2]')
        t.is(api.posCurrentEntry(), 2, 'api.posCurrentEntry() === 2')
        api.prevEntry()
        t.is(api.currentEntry(), entries[1], 'api.prevEntry() # api.currentEntry() === entries[1]')
        t.is(api.posCurrentEntry(), 1, 'api.posCurrentEntry() === 1')
        api.prevEntry()
        t.is(api.currentEntry(), entries[0], 'api.prevEntry() # api.currentEntry() === entries[0]')
        t.is(api.posCurrentEntry(), 0, 'api.posCurrentEntry() === 0')
        t.end()
    })

    t.end()
})

test('.nextFeed(), .prevFeed() : currentFeedの移動', function (t) {
    var api = setup()
    var entries = [
        { xmlurl: '000'
        , title: '000 t 0'
        , link: 'http://000.net/link/0'
        }
      , { xmlurl: '001'
        , title: '001 t 0'
        , link: 'http://001.net/link/0'
        }
      , { xmlurl: '002'
        , title: '002 t 0'
        , link: 'http://002.net/link/0'
        }
      , { xmlurl: '000'
        , title: '000 t 1'
        , link: 'http://000.net/link/1'
        }
      , { xmlurl: '000'
        , title: '000 t 2'
        , link: 'http://000.net/link/2'
        }
    ]

    entries.forEach(function (entry) {
        api.pushEntry(entry)
    })

    t.test('.nextFeed()', function (t) {
        t.deepEqual(api.currentFeed(), [ entries[0], entries[3], entries[4] ]
          , 'api.currentFeed() deepEqual [ entries[0], entries[3], entries[4] ]')
        api.nextFeed()
        t.deepEqual(api.currentFeed(), [ entries[1] ]
          , 'api.currentFeed() deepEqual [ entries[1] ]')
        t.is(api.currentEntry().title, '001 t 0', 'api.currentEntry().title === "001 t 0"')
        api.nextFeed()
        t.deepEqual(api.currentFeed(), [ entries[2] ]
          , 'api.currentFeed() deepEqual [ entries[2] ]')
        t.is(api.currentEntry().title, '002 t 0', 'api.currentEntry().title === "002 t 0"')
        api.nextFeed()
        t.deepEqual(api.currentFeed(), [ entries[0], entries[3], entries[4] ]
          , 'api.currentFeed() deepEqual [ entries[0], entries[3], entries[4] ]')
        t.is(api.currentEntry().title, '000 t 0', 'api.currentEntry().title === "000 t 0"')

        t.end()
    })

    t.test('.prevFeed()', function (t) {
        api.prevFeed()
        t.deepEqual(api.currentFeed(), [ entries[2] ]
          , 'api.currentFeed() deepEqual [ entries[2] ]')
        t.is(api.currentEntry().title, '002 t 0', 'api.currentEntry().title === "002 t 0"')
        api.prevFeed()
        t.deepEqual(api.currentFeed(), [ entries[1] ]
          , 'api.currentFeed() deepEqual [ entries[1] ]')
        t.is(api.currentEntry().title, '001 t 0', 'api.currentEntry().title === "001 t 0"')
        api.prevFeed()
        t.deepEqual(api.currentFeed(), [ entries[0], entries[3], entries[4] ]
          , 'api.currentFeed() deepEqual [ entries[0], entries[3], entries[4] ]')
        t.is(api.currentEntry().title, '000 t 0', 'api.currentEntry().title === "000 t 0"')

        t.end()
    })

    t.end()
})

test('.grepFeedIndexList(length)', function (t) {
    var api = setup()
    var entries = [
        { xmlurl: '000'
        , title: '000 t 0'
        , link: 'http://000.net/link/0'
        }
      , { xmlurl: '001'
        , title: '001 t 0'
        , link: 'http://001.net/link/0'
        , meta: {
            title: 'TITLE 001'
          }
        }
      , { xmlurl: '002'
        , title: '002 t 0'
        , link: 'http://002.net/link/0'
        , meta: {
            link: 'LINK 002'
          }
        }
      , { xmlurl: '003'
        , title: '003 t 0'
        , link: 'http://003.net/link/0'
        }
      , { xmlurl: '004'
        , title: '004 t 0'
        , link: 'http://004.net/link/0'
        }
    ]

    entries.forEach(function (entry) {
        api.pushEntry(entry)
    })

    t.test('api.grepFeedIndexList() # 全てのFeedIndexListを返す', function (t) {
        var greped = api.grepFeedIndexList()
        t.deepEqual(greped, [ '000', 'TITLE 001', 'LINK 002', '003', '004' ]
          , 'greped deepEqual [ "000", "TITLE 001", "LINK 002", "003", "004" ]')
        t.end()
    })
    t.test('api.grepFeedIndexList(over_length) # 全てのFeedIndexListを返す', function (t) {
        var greped = api.grepFeedIndexList()
        t.deepEqual(greped, [ '000', 'TITLE 001', 'LINK 002', '003', '004' ]
          , 'greped deepEqual [ "000", "TITLE 001", "LINK 002", "003", "004" ]')
        t.end()
    })
    t.test('api.grepFeedIndexList(3)', function (t) {
        var maxLen = 3
        var greped = api.grepFeedIndexList(maxLen)
        t.deepEqual(greped,   ['004', '000', 'TITLE 001']
          , 'greped deepEqual [ "004", "000", "TITLE 001" ]')

        api.nextFeed()
        greped = api.grepFeedIndexList(maxLen)
        t.deepEqual(greped,   ['000', 'TITLE 001', 'LINK 002']
          , 'greped deepEqual [ "000", "TITLE 001", "LINK 002"]')

        api.nextFeed()
        greped = api.grepFeedIndexList(maxLen)
        t.deepEqual(greped,   ['TITLE 001', 'LINK 002', '003']
          , 'greped deepEqual ["TITLE 001", "LINK 002", "003"]')

        api.nextFeed()
        greped = api.grepFeedIndexList(maxLen)
        t.deepEqual(greped,   ['LINK 002', '003', '004']
          , 'greped deepEqual ["LINK 002", "003", "004"]')

        api.nextFeed()
        greped = api.grepFeedIndexList(maxLen)
        t.deepEqual(greped,   ['003', '004', '000']
          , 'greped deepEqual ["003", "004", "000"]')

        t.end()
    })

    t.end()
})

test('.grepEntriesIndexList(length)', function (t) {
    var api = setup()
    var entries = [
        { xmlurl: '000'
        , title: '000 t 0'
        , link: 'http://000.net/link/0'
        }
      , { xmlurl: '001'
        , title: '001 t 0'
        , link: 'http://001.net/link/0'
        }
      , { xmlurl: '000'
        , title: '000 t 1'
        , link: 'http://000.net/link/1'
        }
      , { xmlurl: '000'
        , link: 'http://000.net/link/2'
        }
      , { xmlurl: '000'
        , title: '000 t 3'
        }
      , { xmlurl: '000' }
    ]

    entries.forEach(function (entry) {
        api.pushEntry(entry)
    })

    t.test('api.grepEntriesIndexList() # currentFeedの全てのentryを返す', function (t) {
        var greped = api.grepEntriesIndexList()
        t.deepEqual(greped, ['000 t 0', '000 t 1', 'http://000.net/link/2', '000 t 3', 'none']
          , 'grep deepEqual ["000 t 0", "000 t 1", "http://000.net/link/2", "000 t 3", "none"]')
        t.end()
    })

    t.test('api.grepEntriesIndexList(over_length) # currentFeedの全てのentryを返す', function (t) {
        var greped = api.grepEntriesIndexList(10)
        t.deepEqual(greped, ['000 t 0', '000 t 1', 'http://000.net/link/2', '000 t 3', 'none']
          , 'grep deepEqual ["000 t 0", "000 t 1", "http://000.net/link/2", "000 t 3", "none"]')
        t.end()
    })

    t.test('api.grepEntriesIndexList(length) # currentFeedのentryを返す', function (t) {
        var maxLen = 3
        var greped = api.grepEntriesIndexList(maxLen)
        t.deepEqual(greped, ['none', '000 t 0', '000 t 1']
          , 'grep deepEqual ["none", "000 t 0", "000 t 1"]')

        api.nextEntry()
        api.nextEntry()

        var greped = api.grepEntriesIndexList(maxLen)
        t.deepEqual(greped, ['000 t 1', 'http://000.net/link/2', '000 t 3']
          , 'grep deepEqual ["000 t 1", "http://000.net/link/2", "000 t 3"]')

        t.end()
    })

    t.end()
})

function setup () {
    return Object.create(api.feeds, {
        feedList: {
            value: {}
        }
      , feedIndexList: {
            value: []
        }
    })
}

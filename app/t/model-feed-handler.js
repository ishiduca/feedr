var test = require('tape').test
var Feed = require('../api/model/feed-handler')

test('can use module', function (t) {
    t.ok(Feed.prototype.getCurrentEntry, 'ok Feed')
    t.end()
})
test('エントリーの取得と初期化', function (t) {
    var m = new Feed
    t.ok(m, 'var model = new Feed')

    t.test('entryを持たない状態で、.getCurrentFeed(), .getCurrentEntry()', function (t) {
        t.deepEqual(m.getCurrentFeed(), [], 'model.getCurrentFeed() === []')
        t.deepEqual(m.getCurrentEntry(), {}, 'model.getCurrentEntry() === {}')
        t.end()
    })

    var entry = {
        xmlurl: '000'
      , title: '000 title'
      , link: 'http://000.net/link'
    }

    m.push(entry).cursorInit()

    t.is(m.getCurrentEntry(), entry
      , 'model.push(entry).cursorInit().getCurrentEntry() === entry')
    t.is(m.posCurrentEntry(), 0, 'model.posCurrentEntry() === 0')
    t.is(m.posFeed(), 0, 'model.posFeed() === 0')

    console.log('エントリー１つの時点で移動メソッドを使う')

    m.nextEntry()
    t.is(m.getCurrentEntry(), entry, 'model.nextEntry().getCurrentEntry() === entry')
    t.is(m.posCurrentEntry(), 0, 'model.posCurrentEntry() === 0')

    m.prevEntry()
    t.is(m.getCurrentEntry(), entry, 'model.prevEntry().getCurrentEntry() === entry')
    t.is(m.posCurrentEntry(), 0, 'model.posCurrentEntry() === 0')

    m.nextFeed()
    t.is(m.getCurrentEntry(), entry, 'model.nextFeed().getCurrentEntry() === entry')
    t.is(m.posFeed(), 0, 'model.posFeed() === 0')

    m.prevFeed()
    t.is(m.getCurrentEntry(), entry, 'model.prevFeed().getCurrentEntry() === entry')
    t.is(m.posFeed(), 0, 'model.posFeed() === 0')

    console.log('エントリーの削除 model.shift(entry)')

    var flg = m.shift(entry)

    t.ok(flg, 'true === model.shift()')
    t.deepEqual(m.feeds[entry.xmlurl], [], '* model.feeds[entry.xmlurl] == []')

    t.end()
})

test('.nextEntry(), .prevEntry() : currentEntryの移動', function (t) {
    var m = new Feed
    var entries = [
        { xmlurl: '000'
        , title: '000 title 0'
        , link: 'http://000.net/link/0'
        }
      , { xmlurl: '000'
        , title: '000 title 1'
        , link: 'http://000.net/link/1'
        }
      , { xmlurl: '000'
        , title: '000 title 2'
        , link: 'http://000.net/link/2'
        }
    ]

    entries.forEach(function (entry) { m.push(entry) })

    m.cursorInit()

    t.is(m.countFeeds(), 1, 'model.countFeeds() === 1')
    t.is(m.countCurrentEntries(), 3, 'model.countCurrentEntries() === 3')

    console.log('.nextEntry()')

    m.nextEntry()
    t.is(m.getCurrentEntry(), entries[1], 'model.nextEntry() getCurrentEntry() === entries[1]')
    t.is(m.posCurrentEntry(), 1, 'model.posCurrentEntry() === 1')

    m.nextEntry()
    t.is(m.getCurrentEntry(), entries[2], 'model.nextEntry() getCurrentEntry() === entries[2]')
    t.is(m.posCurrentEntry(), 2, 'model.posCurrentEntry() === 2')

    m.nextEntry()
    t.is(m.getCurrentEntry(), entries[0], 'model.nextEntry() getCurrentEntry() === entries[0]')
    t.is(m.posCurrentEntry(), 0, 'model.posCurrentEntry() === 0')

    console.log('.prevEntry()')

    m.prevEntry()
    t.is(m.getCurrentEntry(), entries[2], 'model.nextEntry() getCurrentEntry() === entries[2]')
    t.is(m.posCurrentEntry(), 2, 'model.posCurrentEntry() === 2')

    m.prevEntry()
    t.is(m.getCurrentEntry(), entries[1], 'model.nextEntry() getCurrentEntry() === entries[1]')
    t.is(m.posCurrentEntry(), 1, 'model.posCurrentEntry() === 1')

    m.prevEntry()
    t.is(m.getCurrentEntry(), entries[0], 'model.nextEntry() getCurrentEntry() === entries[0]')
    t.is(m.posCurrentEntry(), 0, 'model.posCurrentEntry() === 0')

    t.end()
})

test('.nextFeed(), .prevFeed()', function (t) {
    var m = new Feed
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
      , { xmlurl: '002'
        , title: '002 t 0'
        , link: 'http://002.net/link/0'
        }
      , { xmlurl: '000'
        , title: '000 t 2'
        , link: 'http://000.net/link/2'
        }
    ]

    entries.forEach(function (entry) {
        m.push(entry)
    })

    m.cursorInit()

    console.log('.nextFeed()')

    t.deepEqual(m.getCurrentFeed(), [ entries[0], entries[2], entries[4] ]
      , 'model.getCurrentFeed() -> [entries[0], entries[2], entries[4]]')

    m.nextFeed()
    t.deepEqual(m.getCurrentFeed(), [ entries[1] ]
      , 'model.getCurrentFeed() -> [entries[1]]')
    t.is(m.getCurrentEntry(), entries[1]
      , 'm.getCurrentEntry() === entries[1]')

    m.nextFeed()
    t.deepEqual(m.getCurrentFeed(), [ entries[3] ]
      , 'model.getCurrentFeed() -> [entries[3]]')
    t.is(m.getCurrentEntry(), entries[3]
      , 'm.getCurrentEntry() === entries[3]')

    m.nextFeed()
    t.deepEqual(m.getCurrentFeed(), [ entries[0], entries[2], entries[4] ]
      , 'model.getCurrentFeed() -> [entries[0], entries[2], entries[4]]')
    t.is(m.getCurrentEntry(), entries[0]
      , 'm.getCurrentEntry() === entries[0]')

    console.log('.prevFeed()')

    m.prevFeed()
    t.deepEqual(m.getCurrentFeed(), [ entries[3] ]
      , 'model.getCurrentFeed() -> [entries[3]]')
    t.is(m.getCurrentEntry(), entries[3]
      , 'm.getCurrentEntry() === entries[3]')

    m.prevFeed()
    t.deepEqual(m.getCurrentFeed(), [ entries[1] ]
      , 'model.getCurrentFeed() -> [entries[1]]')
    t.is(m.getCurrentEntry(), entries[1]
      , 'm.getCurrentEntry() === entries[1]')

    m.prevFeed()
    t.deepEqual(m.getCurrentFeed(), [ entries[0], entries[2], entries[4] ]
      , 'model.getCurrentFeed() -> [entries[0], entries[2], entries[4]]')
    t.is(m.getCurrentEntry(), entries[0]
      , 'm.getCurrentEntry() === entries[0]')

    t.end()
})

test('.grepFeeds(num)', function (t) {
    var m = new Feed
    var entries = [
        { xmlurl: '000'
        , title: '000 t 0'
        , link: 'http://000.net/link/0'
        }
      , { xmlurl: '001'
        , title: '001 t 0'
        , link: 'http://001.net/link/0'
        , meta: { title: 'TITLE 001' }
        }
      , { xmlurl: '002'
        , title: '002 t 0'
        , link: 'http://002.net/link/0'
        , meta: { link: 'LINK 002' }
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
        m.push(entry)
    })

    m.cursorInit()

    console.log('model.grepFeeds() # 全てのfeedsを返す')
    t.deepEqual(m.grepFeeds(), ['000','TITLE 001','LINK 002','003','004']
      , 'm.grepFeeds() -> ["000","TITLE 001","LINK 002","003","004"]')

    console.log('model.grepFeeds(over_feeds_length) # 全てのfeedsを返す')
    t.deepEqual(m.grepFeeds(10), ['000','TITLE 001','LINK 002','003','004']
      , 'm.grepFeeds(10) -> ["000","TITLE 001","LINK 002","003","004"]')

    var maxLen = 3
    console.log('model.grepFeeds(%d) # 全てのfeedsを返す', maxLen)
    t.deepEqual(m.grepFeeds(maxLen),  ['004','000', 'TITLE 001']
      , 'm.grepFeeds('+ maxLen +') -> ["004","000","TITLE 001"]')

    m.nextFeed()
    t.deepEqual(m.grepFeeds(maxLen),  ['000','TITLE 001','LINK 002']
      , 'm.grepFeeds('+ maxLen +') -> ["000","TITLE 001","LINK 002"]')

    m.nextFeed()
    t.deepEqual(m.grepFeeds(maxLen),  ['TITLE 001','LINK 002','003']
      , 'm.grepFeeds('+ maxLen +') -> ["TITLE 001","LINK 002","003"]')

    m.nextFeed()
    t.deepEqual(m.grepFeeds(maxLen),  ['LINK 002','003','004']
      , 'm.grepFeeds('+ maxLen +') -> ["LINK 002","003","004"]')

    m.nextFeed()
    t.deepEqual(m.grepFeeds(maxLen),  ['003','004','000']
      , 'm.grepFeeds('+ maxLen +') -> ["003","004","000"]')

    m.prevFeed()
    t.deepEqual(m.grepFeeds(maxLen),  ['LINK 002','003','004']
      , 'm.grepFeeds('+ maxLen +') -> ["LINK 002","003","004"]')

    t.end()
})
//test('.grepEntries(n)', function (t) {
// no tested
//})

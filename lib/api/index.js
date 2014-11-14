'use strict'
var path    = require('path')
var pack    = require('getpack')()
var config  = pack.config.crawler
var Level   = require('level')
var db      = new Level(path.join(pack.dir, config.db))
var Crawler = require('crawler')
var crawler

var clog    = require('colorlog')
var red     = clog().color('red').out(console.error.bind(console)).bind()
var magenta = clog().color('magenta').out(console.log.bind(console)).bind()
var yellow  = clog().color('yellow').out(console.log.bind(console)).bind()
var cyan    = clog().color('cyan').out(console.log.bind(console)).bind()
var green   = clog().color('green').out(console.log.bind(console)).bind()

// this : conn
module.exports.connection = function () {
    onConnection(this)
}
module.exports.error = function (err) {
    var str = String(err)
    console.log(str)
    this.write(JSON.stringify({error: str}))
}

module.exports.close = function (foo) {
    console.log('[close %s]', this)
    crawler.jsonize.unpipe(this)
}

module.exports.pipe = function (src) {
    cyan('[%s pipe %s]', src.constructor.name, this)
}
module.exports.unpipe = function (src) {
    magenta('[%s unpipe %s]', src.constructor.name, this)
    if (null === crawler.jsonize._readableState.pipes)
        crawler.reverse.unpipe(crawler.unlock)
}

module.exports.rebuild = function (value) {
    if ((! crawler.jsonize.readable) && crawler.jsonize._readableState.ended) {
        crawler = null
        onConnection(this)
    }
}


function onConnection (conn) {
    if (!(crawler instanceof Crawler))
        crawler = new Crawler(config, db)

    if ((! crawler.jsonize.readable) || crawler.jsonize._readableState.ended)
        return

    crawler.jsonize.on('end', broadcast)

    crawler.unlock
        .on('pipe', broadcast)
        .on('unpipe', function (src) { /* src = reverse */
            if (crawler.jsonize.readable && ! crawler.jsonize._readableState.ended)
                broadcast()
        })

    crawler.jsonize.pipe(conn)

    if (null === crawler.reverse._readableState.pipes)
        crawler.reverse.pipe(crawler.unlock)

    broadcast()

    function broadcast () {
        var conns = crawler.jsonize._readableState.pipes
        if (null === conns) conns = []
        if (! Array.isArray(conns)) conns = [ conns ]
        conns.forEach(function (conn) {
            conn.write(JSON.stringify({
                method: 'changeCrawlerState'
              , value: crawler.crawlerState
            }))
        })
    }
}

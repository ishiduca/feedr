'use strict'
var clog         = require('colorlog')
var fs           = require('fs')
var OpmlParser   = require('opmlparser')
var IgnoreFilter = require('ignorefilter')
var Semaphore    = require('semaphore')
var Request      = require('request-stream')
var Different    = require('different')
var JSONize      = require('jsonize')

var red     = clog().color('red').out(console.error.bind(console)).bind()
var magenta = clog().color('magenta').out(console.log.bind(console)).bind()
var yellow  = clog().color('yellow').out(console.log.bind(console)).bind()
var cyan    = clog().color('cyan').out(console.log.bind(console)).bind()
var green   = clog().color('green').out(console.log.bind(console)).bind()

function Crawler (config, db) {
    var rs           = this.rs = fs.createReadStream(config.export_xml)
    var opmlparser   = this.opmlparser   = new OpmlParser
    var ignorefilter = this.ignorefilter = new IgnoreFilter(config.ignore_txt)
    var semaphore    = this.semaphore    = new Semaphore(config.semaphore.lock)
    var request      = this.request      = new Request(config.request)
    var different    = this.different    = new Different(db)
    var jsonize      = this.jsonize      = new JSONize

    var reverse = this.reverse = request.reverse
    var unlock  = this.unlock  = semaphore.unlock

    var me = this

    ;[ rs, opmlparser, ignorefilter, semaphore, request, different, jsonize, 
       reverse, unlock
    ].forEach(function (strm) {
        strm.on('error', function (err) {
            red('[%s # %s]', String(err), strm.constructor.name)
        })

        strm.on('end', function () {
            cyan('[%s readable end]', strm.constructor.name)
        })

        if (rs === strm) return

        strm.on('finish', function () {
            cyan('[%s writable finish]', strm.constructor.name)
        })

        if (semaphore.unlock === strm) return

        strm.on('unpipe', function (src) {
            magenta('[%s unpipe %s]'
              , src.constructor.name, strm.constructor.name)

            if ((! src.readable) || src._readableState.ended) return

            src.pipe(strm)
            yellow('[%s Repipe %s]'
              , src.constructor.name, strm.constructor.name)
        })
    })

    unlock
        .on('unpipe', function (src) {
            magenta('[%s unpipe %s]', src.constructor.name, this.constructor.name)
            if ('ended' !== me.crawlerState) me.crawlerState = 'uncrawling'
        })
        .on('pipe', function (src) {
            green('[%s pipe %s]', src.constructor.name, this.constructor.name)
            if ('ended' !== me.crawlerState) me.crawlerState = 'crawling'
        })

    jsonize
        .on('end', function () {
            reverse.unpipe(unlock)
            me.crawlerState = 'ended'
        })

    rs
      .pipe(opmlparser)
      .pipe(ignorefilter)
      .pipe(semaphore)
      .pipe(request)
      .pipe(different)
      .pipe(jsonize)

    yellow('[crawler = new Crawler(config, db)]')
}

module.exports = Crawler

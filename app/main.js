'use strict'
var keymap  = require('./keymap_custom')
var Sock    = require('./wrap_socket')

var sock = new Sock({
    resetMax: 15
  , resetInterval: 1000
  , sockjs_url: '/echo'
})

var api = require('./api')

sock
    .define('changeCrawlerState', api.header)
    .define('entry',              api.main.entry)

var keyAct = keymap()
keyAct
    .on('r', 'rebuild crawler',  api.rebuild.bind(sock))
    .on('j', 'show next entry',            api.main.nextEntry)
    .on('k', 'show prev entry',            api.main.prevEntry)
    .on('s', 'go to next feed',            api.main.nextFeed)
    .on('a', 'go to prev feed',            api.main.prevFeed)
    .on('p', 'do "pin" or "un-pin"',       api.main.pin)
    .on('o', 'change mode pin/normal',     api.main.changeMode)
    .on('v', 'open link of current entry', api.main.open_tab)
    .on('h', 'show help', api.help.bind(keyAct.helpStrs))

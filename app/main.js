'use strict'
var Sock   = require('./wrap_socket')
var keymap = require('./keymap_custom')
var api    = require('./api')

var sock = new Sock({
    resetInterval: 1000
  , resetMax:        15
  , sockjs_url: '/echo'
})

var keyAct = keymap()

sock
  .define('changeCrawlerState', api.header)
  .define('entry', api.main.entry)

keyAct
  .on('h', 'show help', api.help.bind(keyAct.helpStrs))
  .on('r', 'request to rebuild crawler', api.rebuild.bind(sock))
  .on('j', 'show next entry', api.main.nextEntry)
  .on('k', 'show prev entry', api.main.prevEntry)
  .on('s', 'show next feed', api.main.nextFeed)
  .on('a', 'show prev feed', api.main.prevFeed)
  .on('p', 'mark "pin" or "un-pin"', api.main.pin)
  .on('o', 'change mode "favotite(pin)" or "normal"', api.main.changeMode)
  .on('v', 'open link of current entry', api.main.open_tab)

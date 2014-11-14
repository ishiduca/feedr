'use strict'
var Ractive = require('ractive')
var title = document.title
var ract  = new Ractive({
    el: '#header'
  , template: require('../view/header.html')
  , data: {
        title: title
    }
})

module.exports = function (state) {
    ract.set('crawlerState', state)
    console.log(state)
}

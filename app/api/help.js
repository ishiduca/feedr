'use strict'
var Ractive = require('ractive')
var ract    = new Ractive({
    el: '#footer'
  , template: require('../view/footer.html')
  , data: {
        display: false
    }
})

module.exports = function () {
// this: keyAct
    ract.get('help') || ract.set('help', this)
    ract.set('display', ! ract.get('display'))
}

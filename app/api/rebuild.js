'use strict'
module.exports = function () {
    // this: sock
    this.send({method: 'rebuild', value: 1})
    console.log('[sock.send( method: "rebuild", value: 1 )]')
}

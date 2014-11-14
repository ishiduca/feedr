'use strict'
function Domain () {}
Domain.prototype.intercept = function (f) {
    var me = this
    return function callback () {
        var args = [].slice.apply(arguments)
        var err  = args.shift()
        ;(err && err.message) ? me.onError(err)
                              : f.apply(null, args)
    }
}

module.exports.create = function (onError) {
    var d = new Domain
    'function' === typeof onError
    d.onError = onError
    return d
}
module.exports.Domain = Domain

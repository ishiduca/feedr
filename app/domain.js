'use strict'
function Domain () {}

Domain.prototype.intercept = function (f, she) {
    var me = this
    return function () {
        var args = [].slice.apply(arguments)
        var err  = args.shift()
        var onError = 'function' === typeof me.onError
                    ? me.onError
                    : function (err) { console.log(err) }

        ;(err && err.message) ? onError.apply((she || null), [err])
                              : f.apply((she || null), args)
    }
}

module.exports.create = function (onError) {
    var d = new Domain
    'function' === typeof onError && (d.onError = onError)
    return d
}
module.exports.Domain = Domain

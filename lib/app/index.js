var path = require('path')
var mm   = require('mm')
var app  = mm.create()
var pack = require('getpack')()

var config        = pack.config.mainpage || {}
config.version    = pack.version
config.name       = pack.name
config.sockjs_src = pack.config.sockjs.src

app.use('serve-favicon', path.join(pack.dir, 'favicon.png'))
app.use('static', {root: path.join(pack.dir, 'public'), dirs: ['/bower_components', '/js', '/css']})
app.use('mainpage', {template: path.join(pack.dir, 'view/index.html'), config: config})
app.use('404')

module.exports = app

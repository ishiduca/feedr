var app    = require('app')
var socket = require('app_socket')
var pack   = require('getpack')()
var port   = pack.config.server.port

socket(app.server)

app.server.listen(port
  , console.log.bind(console, 'server start to listen on port %s', port))

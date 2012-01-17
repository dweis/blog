var application = require('./app/lib/application')
  , config = application.getConfig()
  , log = require('logging').from(__filename)
  , cluster = require('cluster')
  , numCPUs = require('os').cpus().length

var env = "development"

if (typeof process.env.NODE_ENV != 'undefined' && process.env.NODE_ENV == 'production') {
  env = process.env.NODE_ENV
}

if (cluster.isMaster) {
  log('App started in ' + env + ' mode...')
  log('App is listening on ' + config.appIp + ':' + config.appPort + '...')

  for (var i = 0; i < numCPUs; i++) {
    cluster.fork()

    cluster.on('death', function(worker) {
      console.log('worker ' + worker.pid + ' died')
    })
  }
} else {
  require('./app').listen(config.appPort, config.appIp)
}

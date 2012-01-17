var application = require('./app/lib/application')
  , config = application.getConfig()
  , express = require('express')
  , stylus = require('stylus')
  , jade = require('jade')
  , auth = require('connect-auth')
  , mongoose = require('mongoose')
  , MongoStore = require('connect-mongodb')
  , helpers = require(__dirname + '/app/helpers/helpers')
  , log = require('logging').from(__filename)
  , NotFound = require(__dirname + '/app/lib/errors').NotFound
  , app = express.createServer()

var airbrake = require('airbrake').createClient(config.airbrakeKey)
airbrake.handleExceptions()

app.use(stylus.middleware({ src: __dirname + '/app'
                          , dest: __dirname + '/public'
                          , compress: true
                          , debug: false
                          }))

app.configure(function(){
  app.use(express.cookieParser())
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  //app.use(express.logger())

  app.dynamicHelpers(helpers.dynamicHelpers)
  app.helpers(helpers.helpers)

  app.set('view engine', 'jade')
  app.set('views', __dirname + '/app/views');

  app.use(express.session({ secret: config.sessionSecret }))

  app.use(auth([
      auth.Facebook({ appId: config.fbAppId
                    , appSecret: config.fbAppSecret
                    , scope: 'email'
                    , callback: config.fbCallbackAddress
                    })
               ]))
})


app.error(function(err, req, res, next){
  if (err instanceof NotFound) {
    res.render('404', { status: 404 })
  } else {
    res.render('500', { status: 500 })

    if (err instanceof Error) {
      if (config.airbrakeEnabled) {
        airbrake.notify(err)
      }

      log(err.stack)
    } else {
      log(err)
    }
  }
})

app.configure('development', function() {
  app.use(express.static(__dirname + '/public'))
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
  app.set('view cache', false)
})

app.configure('testing', function() {
  app.use(express.static(__dirname + '/public'))
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
  app.set('view cache', false)
})

app.configure('production', function() {
  const oneYear = 31557600000
  app.use(express.static(__dirname + '/public', { maxAge: oneYear }))
  app.use(express.errorHandler())
  app.set('view cache', true) 
})

mongoose.connect('mongodb://localhost/' + config.database)

require(__dirname + '/app/models/models')(mongoose)
require(__dirname + '/config/routes')(app, mongoose)

app.db = mongoose

module.exports = app

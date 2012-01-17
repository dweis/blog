var NotFound = require('../app/lib/errors').NotFound

module.exports = function(app, models) { 
  app.get('/', function(req, res) {
    res.redirect('/posts', 301)
  })

  require('../app/controllers/auth')(app, models)
  require('../app/controllers/post')(app, models)
  require('../app/controllers/comment')(app, models)
  require('../app/controllers/rss')(app, models)

  app.all('*', function(req, res) {
    throw new NotFound('Page not found.')
  })
}


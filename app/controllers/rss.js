module.exports = function(app, mongoose) {
  var config = require('config').config
    , log = require('logging').from(__filename)
    , Post = mongoose.model('Post')
    , RSS = require('rss')
    , _ = require('underscore')
    , require_admin = require('../lib/util').require_admin

  app.get('/rss.xml', function(req, res) {
    Post.getLatest(function(posts, users){
      res.header('Content-Type', 'text/xml')

      var feed = new RSS({
          title: config.siteName
        , description: config.siteDescription
        , author: config.siteAuthor
        , feed_url: config.baseUrl + 'rss.xml'
        , site_url: config.baseUrl
      })

      _.each(posts, function(post, i) {
        feed.item({
            title:  post.title
          , description: post.excerpt
          , url: config.baseUrl + 'posts/' + post.slug
          , author: users[post.author].name
          , date: post.created
        })
      })

      res.end(feed.xml())
    })
  })
}

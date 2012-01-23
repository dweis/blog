module.exports = function(app, mongoose) {
  var config = require('config').config
    , log = require('logging').from(__filename)
    , Post = mongoose.model('Post')
    , User = mongoose.model('User')
    , _ = require('underscore')
    , adminRequired = require('../lib/util').adminRequired
    , NotFound = require('../lib/errors').NotFound

  app.get('/posts', function(req, res) {
    Post.getLatest(function(posts, users) {
      Post.getTags(function(tags){
        res.render('posts/index', {
            'title': 'Latest posts on ' + config.siteName
          , 'posts': posts
          , 'users': users
          , 'tags': tags
        })
      })
    })
  })

  app.get('/posts.json', function(req, res) {
    Post.getLatest(function(posts, users){
      res.send(JSON.stringify({ posts: posts
                              , users: users }))
    })
  })

  app.get('/posts/tag/:tag', function(req, res) {
    Post.getByTag(req.params.tag, function(posts, users) {
      res.render('posts/index', {
          'title': 'Posts filed under "' + req.params.tag + '"'
        , 'posts': posts
        , 'users': users
      })
    })
  })

  app.get('/posts/new', function(req, res) {
    adminRequired(req, res, function(){
      res.render('posts/new', {
        'title': 'New post'
      })
    })
  })

  app.get('/posts/:slug', function(req, res) {
    Post.getBySlug(req.params.slug, function(post, users){
      if (post)  {
        res.render('posts/show', {
            'title': post.title
          , 'post': post
          , 'users': users
        })
      } else {
        res.render('404', {status: 404})
      }
    })
  })

  app.post('/posts', function(req, res) {
    adminRequired(req, res, function() {
      var tags = []

      var parts = req.body.tags.split(',')

      _.each(parts, function(part, idx) {
        tags.push(part.trim())
      })

      var post = new Post({
          author: req.session.user_id
        , title: req.body.title
        , excerpt: req.body.excerpt
        , body: req.body.body
        , tags: tags
      })

      post.save(function(err) {
        if (err) { 
          log(err)
          _.each(err.errors, function(reason, path) {
            req.flash('error', path + ': ' + reason)
          })
        } else {
          req.flash('info', 'New post created.')
          log('Created new post: ' + req.body.title)
        }

        res.redirect('/posts')
      })
    })
  })

  app.del('/posts/:slug/delete', function(req, res) {
    adminRequired(req, res, function() {
      Post.remove({slug: req.params.slug}, function(err) {
        if (err) {
          log(err)
          req.flash('error', 'Failed to delete post.')
        } else {
          req.flash('info', 'Deleted post.')
          log('Deleted post wit slug: ' + req.params.slug)
        }
        res.redirect('back')
      })
    })
  })

  app.get('/posts/:slug/edit', function(req, res) {
    adminRequired(req, res, function() {
      Post.findOne({slug: req.params.slug}, function(err, post) {
        if (err) {
          log(err)
          res.redirect('/posts')
        } else {
          res.render('posts/edit', {
              'title': 'Editing "' + post.title + '"'
            , 'post': post
          })
        }
      })
    })
  })

  app.put('/posts/:slug', function(req, res) {
    adminRequired(req, res, function(){
      Post.findOne({slug: req.params.slug}, function(err, post) {
        if (err) {
          log(err)
          res.redirect('/')
        } else {
          var tags = []

          var parts = req.body.tags.split(',')

          _.each(parts, function(part, idx) {
            tags.push(part.trim())
          })

          post.title = req.body.title
          post.excerpt = req.body.excerpt
          post.body = req.body.body
          post.tags = tags

          post.save(function(err) {
            if (err) { 
              log(err)
              _.each(err.errors, function(reason, path) {
                req.flash('error', path + ': ' + reason)
              })

              res.render('posts/edit', {
                  'title': 'Editing "' + post.title + '"'
                , 'post': post
              })
            } else {
              req.flash('info', 'The post has been updated.')
              res.redirect('/posts')
            }
          })
        }
      })
    })
  })
}

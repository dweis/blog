module.exports = function(app, mongoose) {
  var Post = mongoose.model('Post')
    , User = mongoose.model('User')
    , log = require('logging').from(__filename)
    , _ = require('underscore')
    , adminRequired = require('../lib/util').adminRequired
    , loginRequired = require('../lib/util').loginRequired

  app.post('/posts/:slug/comments', function(req, res) {
    Post.findOne({slug: req.params.slug}, function(err, post) {
      loginRequired(req, res, function() {
        if (err) {
          log(err)
        } else {
          log('Added new comment on ' + post.title + ' by ' + req.getAuthDetails().user.email)

          post.comments.push({
              'author': req.session.user_id
            , 'body': req.body.body
          })
  
          post.save(function(err) {
            if (err) log(err.stack)

            res.redirect('/posts/' + req.params.slug)
          })
        }
      })
    })
  })

  app.del('/posts/:slug/comments/:id', function(req, res) {
    adminRequired(req, res, function() {
      Post.findOne({slug: req.params.slug}, function(err, post) {
        if (err) {
          log(err)
        } else {
          _.each(post.comments, function(comment, idx) {
            if (comment._id == req.params.id) {
              log(['Deleted comment on ' + post.title + ':', comment])
              post.comments[idx].remove()
            }
          })

          post.save(function(err) {
            if (err) log(err)
          })
        }

        res.redirect('back')
      })
    })
  })
}

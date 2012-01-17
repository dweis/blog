var vows = require('vows')
  , assert = require('assert')
  , mongoose = require('mongoose')

require('../../app/models/models')(mongoose)

function setup(callback) {
  var db = mongoose.createConnection('mongodb://localhost/blog_test')

  var Post = db.model('Post')

  Post.remove({}, function(){
    callback(Post)
  })

  return db
}

function getSanePostValues() {
  return {
      author: '4de705bb402a40168f000004'
    , title: 'Testing'
    , body: 'This is a test post'
  }
}

vows.describe('Post Model')
  .addBatch({
    'WHEN I save a new post with valid data': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(Post) {
          var post = new Post(getSanePostValues())

          post.save(callback)
        })
      }
    , 'THEN it should be successfull': function(err, post) {
        assert.equal(err, null)
      }
    , 'AND it should have set the created time stamp': function(err, post) {
        assert.ok(post.created)
      }
    , 'AND it should have an updated time stamp': function(err, post) {
        assert.ok(post.updated)
      }
    , 'AND it should have created a slug': function(err, post) {
        assert.ok(post.slug.match(/testing/))
      }
    , teardown:  function() {
        this.db.close()
      }
    }

  , 'WHEN I attempt to save a post without an author': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(Post) {
          var post = new Post(getSanePostValues())

          post.author = undefined

          post.save(callback)
        })
      }
    , 'THEN it should fail to save': function(err, post) {
        assert.ok(err instanceof Error)
      }
    , teardown: function() {
        this.db.close()
      }
    }

  , 'WHEN I attempt to save a post without a body': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(Post) {
          var post = new Post(getSanePostValues())

          post.body = undefined

          post.save(callback)
        })
      }
    , 'THEN it should fail to save': function(err, post) {
        assert.ok(err instanceof Error)
      }
    , teardown: function() {
        this.db.close()
      }
    }

  , 'WHEN I attempt to save a post without a title': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(Post) {
          var post = new Post(getSanePostValues())

          post.title = undefined

          post.save(callback)
        })
      }
    , 'THEN it should fail to save': function(err, post) {
        assert.notEqual(err, null)
      }
    , teardown: function() {
        this.db.close()
      }

    }
  })

  .export(module)

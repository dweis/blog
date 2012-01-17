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

function getSaneCommentValues() {
  return {
      author: '4de705bb402a40168f000004'
    , body: 'This is a test comment'
  }
}

vows
  .describe('Comment Model')

  .addBatch({
    'WHEN I create a new comment with valid data': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(Post){
          var post = new Post(getSanePostValues())

          post.comments.push(getSaneCommentValues())

          post.save(function(err) {
            if (err) {
              callback(err, post)
            } else {
              Post.findOne({}, callback)
            }
          })
        })
      }
    , 'THEN it should save': function(err, post) {
        assert.ok(!err)
      }
    , 'AND it should should have a comment': function(err, post) {
        assert.equal(post.comments.length, 1)
      }
    , 'AND the comment body should be "This is a test comment"': function(err, post) {
        assert.equal(post.comments[0].body, 'This is a test comment')
      }
    , 'AND the comment author should be "4de705bb402a40168f000004"': function(err, post) {
        assert.equal(post.comments[0].author, '4de705bb402a40168f000004')
      }
    , teardown: function() {
        this.db.close()
      }
    }
  })

  .addBatch({
    'WHEN I save a comment without an author': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(Post){
          var post = new Post(getSanePostValues())

          var values = getSaneCommentValues()
          values.author = undefined

          post.comments.push(values)

          post.save(function(err) {
            if (err) {
              callback(err, post)
            } else {
              Post.findOne({}, callback)
            }
          })
        })
      }
    , 'THEN it should fail': function(err, post) {
        assert.ok(err instanceof Error)
      }
    }
  })

  .addBatch({
    'WHEN I save a comment without a body': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(Post){
          var post = new Post(getSanePostValues())

          var values = getSaneCommentValues()
          values.body = undefined

          post.comments.push(values)

          post.save(function(err) {
            if (err) {
              callback(err, post)
            } else {
              Post.findOne({}, callback)
            }
          })
        })
      }
    , 'THEN it should fail': function(err, post) {
        assert.ok(err instanceof Error)
      }
    }
  })

  .export(module)

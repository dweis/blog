var mocha = require('mocha')
  , should = require('should')
  , mongoose = require('mongoose')

require('../app/models/models')(mongoose)

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

describe('Comment Model', function(){
  var db, Post

  beforeEach(function(done) {
    db = mongoose.createConnection('mongodb://localhost/blog_test')

    Post = db.model('Post')

    Post.remove({}, function() {
      done()
    })
  })

  afterEach(function(done) {
    db.close()
    done()
  })

  describe('I create a new comment with valid data', function() {
    it('should save', function(done) {
      var post = new Post(getSanePostValues())

      post.comments.push(getSaneCommentValues())

      post.save(function(err) {
        should.not.exist(err)
        post.comments.length.should.equal(1)
        post.comments[0].body.should.equal('This is a test comment')
        done()
      })
    })
  })

  describe('I save a comment without an author', function() {
    it('should fail to save', function(done) {
      var post = new Post(getSanePostValues())

      var values = getSaneCommentValues()

      values.author = undefined

      post.comments.push(values)

      post.save(function(err) {
        should.exist(err)
        done()
      })
    })
  })

  describe('I save a comment without a body', function() {
    it('should fail to save', function(done) {
      var post = new Post(getSanePostValues())

      var values = getSaneCommentValues()

      values.body = undefined

      post.comments.push(values)

      post.save(function(err) {
        should.exist(err)
        done()
      })
    })
  })
})

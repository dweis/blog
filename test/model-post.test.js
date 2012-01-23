var mocha = require('mocha')
  , should = require('should')
  , mongoose = require('mongoose')

function getSanePostValues() {
  return {
      author: '4de705bb402a40168f000004'
    , title: 'Testing'
    , body: 'This is a test post'
  }
}

require('../app/models/models')(mongoose)

describe('Post Model', function() {
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

  describe('I save a new post with valid data', function() {
    it ('should be successful', function(done) {
      var post = new Post(getSanePostValues())

      post.save(function(err) {
        should.not.exist(err)
        should.exist(post.created)
        should.exist(post.updated)
        post.slug.match(/testing/)
        done()
      })
    })
  })

  describe('I attempt to save a post without an author', function() {
    it ('should fail to save', function(done) {
      var post = new Post(getSanePostValues())

      post.author = undefined

      post.save(function(err) {
        should.exist(err)
        done()
      })
    })
  })


  describe('I attempt to save a post without an body', function() {
    it ('should fail to save', function(done) {
      var post = new Post(getSanePostValues())

      post.body = undefined

      post.save(function(err) {
        should.exist(err)
        done()
      })
    })
  })

  describe('I attempt to save a post without a title', function() {
    it ('should fail to save', function(done) {
      var post = new Post(getSanePostValues())

      post.title = undefined

      post.save(function(err) {
        should.exist(err)
        done()
      })
    })
  })
})

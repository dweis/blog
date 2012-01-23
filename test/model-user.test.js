var mocha = require('mocha')
  , should = require('should')
  , mongoose = require('mongoose')

function getSaneUserValues() {
  return {
      id: 1241251125
    , email: 'test@test.com'
    , first_name: 'test'
    , last_name: 'user'
    , link: 'http://testuser.com'
    , hometown: 'somewhere'
    , gender: 'male'
    , timezone: 1
  }
}
require('../app/models/models')(mongoose)

describe('User Model', function() {
  var db, User

  beforeEach(function(done) {
    db = mongoose.createConnection('mongodb://localhost/blog_test')

    User = db.model('User')

    User.remove({}, function() {
      done()
    })
  })

  afterEach(function(done) {
    db.close()
    done()
  })

  describe('I save a new user with valid data', function() {
    it ('should be successful', function(done) {
      var user = new User(getSaneUserValues())

      user.save(function(err) {
        should.not.exist(err)
        should.exist(user.created)
        done()
      })
    })
  })

  describe('I attempt to save a user with a string as the id', function() {
    it ('should fail to save', function(done) {
      var user = new User(getSaneUserValues())

      user.id = 'a'

      user.save(function(err) {
        should.exist(err)
        done()
      })
    })
  })

  describe('I attempt to save a user with an id of less than 1', function() {
    it ('should fail to save', function(done) {
      var user = new User(getSaneUserValues())

      user.id = 0

      user.save(function(err) {
        should.exist(err)
        done()
      })
    })
  })

  describe('I attempt to save a user without an email address', function() {
    it ('should fail to save', function(done) {
      var user = new User(getSaneUserValues())

      user.email = undefined

      user.save(function(err) {
        should.exist(err)
        done()
      })
    })
  })

  describe('I attempt to save a user without an email address', function() {
    it ('should fail to save', function(done) {
      var user = new User(getSaneUserValues())

      user.email = undefined

      user.save(function(err) {
        should.exist(err)
        done()
      })
    })
  })

  describe('I attempt to save a user with an invalid email address', function() {
    it ('should fail to save', function(done) {
      var user = new User(getSaneUserValues())

      user.email = 'test@test'

      user.save(function(err) {
        should.exist(err)
        done()
      })
    })
  })

  describe('I try to save two users with the same id', function() {
    it ('should fail to save', function(done) {
      var user = new User(getSaneUserValues())

      user.save(function(err) {
        var anotherUser = new User(getSaneUserValues())

        anotherUser.save(function(err) {
          should.exist(err)
          done()
        })
      })
    })
  })

  describe('I attempt to save a user with an invalid link', function() {
    it ('should fail to save', function(done) {
      var user = new User(getSaneUserValues())

      user.link = 'blah'

      user.save(function(err) {
        should.exist(err)
        done()
      })
    })
  })
})

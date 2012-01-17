var vows = require('vows')
  , assert = require('assert')
  , mongoose = require('mongoose')

require('../../app/models/models')(mongoose)

var db = mongoose.createConnection('mongodb://localhost/blog_test')

function setup(callback) {
  var User = db.model('User')

  User.remove({}).exec(function(){
    callback(User)
  })

  return db
}

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

vows
  .describe('User Model')

  .addBatch({
    'WHEN I create new new user with valid data ': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(User) {
          var user = new User(getSaneUserValues())

          user.save(callback)
        })
      },
      'THEN it should set the created time stamp': function(err, user) {
        assert.equal(err, null)
        assert.notEqual(user.created, null)
      },
      teardown: function() {
        this.db.close()
      }
    }

  , 'WHEN I try to save a user with a string as the id': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(User) {
          var user = new User(getSaneUserValues())

          user.id = 'a'

          user.save(callback)
        })
      },
      'THEN it should fail to save': function(err, user) {
        assert.notEqual(err, null)
      },
      teardown: function() {
        this.db.close()
      }
    }

  , 'WHEN I try to save with an id of less than 1': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(User) {
          var user = new User(getSaneUserValues())

          user.id = 0

          user.save(callback)
        })
      },
      'THEN it should fail to save': function(err, user) {
        assert.notEqual(err, null)
        assert.equal(err.message, 'Validation failed')
      },
      teardown: function() {
        this.db.close()
      }
    }

  , 'WHEN I try to save without an email address': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(User) {
          var user = new User(getSaneUserValues())

          user.email = null

          user.save(callback)
        })
      },
      'THEN it should fail to save': function(err, user) {
        assert.notEqual(err, null)
        assert.equal(err.message, 'Validation failed')
      },
      teardown: function() {
        this.db.close()
      }
    }

  , 'WHEN I try to save with an invalid email address': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(User) {
          var user = new User(getSaneUserValues())

          user.email = 'test@test'

          user.save(callback)
        })
      },
      'THEN it should fail to save': function(err, user) {
        assert.notEqual(err, null)
        assert.equal(err.message, 'Validation failed')
      },
      teardown: function() {
        this.db.close()
      }
    }

  , 'WHEN I try to save two users with the same id': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(User) {
          var user = new User(getSaneUserValues())

          user.save(function(err, user) {
            var anotherUser = new User(getSaneUserValues())

            anotherUser.save(callback)
          })
        })
      },
      'THEN it should fail to save the second one': function(err, user) {
        assert.notEqual(err, null)
        assert.ok(err.message.match(/duplicate key error/))
      },
      teardown: function() {
        this.db.close()
      }
    }

  , 'WHEN I try to save a user with an invalid link': {
      topic: function() {
        var callback = this.callback

        this.db = setup(function(User) {
          var user = new User(getSaneUserValues())

          user.link = 'blah'

          user.save(callback)
        })
      },
      'THEN it should fail to save': function(err, user) {
        assert.notEqual(err, null)
        assert.equal(err.message, 'Validation failed')
      },
      teardown: function() {
        this.db.close()
      }
    }
  })

  .export(module)

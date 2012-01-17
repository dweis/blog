module.exports = function(mongoose) {
  var Schema = mongoose.Schema
    , _ = require('underscore')
    , ObjectId = Schema.ObjectId
    , NotFound = require('../lib/errors').NotFound

  require("mongoose-types").loadTypes(mongoose)

  var Email = mongoose.SchemaTypes.Email
  var Url = mongoose.SchemaTypes.Url

  var User = new Schema({
      id: { type: Number, unique: true, min: 1 }
    , email: Email
    , first_name: String
    , last_name: String
    , link: Url
    , hometown: String
    , gender: { type: String, enum: ['male', 'female'] }
    , timezone: Number
    , created: { type: Date, default: Date.now }
  })

  mongoose.model('User', User)

  var Admin = new Schema({
      user_id: { type: Number, unique: true }
    , created: { type: Date, default: Date.now }
  })

  mongoose.model('Admin', Admin)

  var Comment = new Schema({
      author: { type: ObjectId, validate: /[a-z0-9]{24}/, required: true }
    , body: { type: String, validate: /.+/, required: true }
    , created: { type: Date, default: Date.now }
  })

  mongoose.model('Comment', Comment)

  var Post = new Schema({
      author: { type: ObjectId, validate: /[a-z0-9]{24}/, required: true }
    , title: { type: String, validate: /.+/, required: true }
    , excerpt: { type: String }
    , body: { type: String, validate: /.+/, required: true }
    , slug: String
    , tags: [String]
    , comments: [Comment]
    , created: { type: Date, default: Date.now }
    , updated: { type: Date, default: Date.now }
  })

  Post.pre('save', function(next) {
    this.set('updated', new Date())
    next()
  })

  Post.statics.getLatest = function(callback, page, perPage) {
    var skip = 0
    var limit = 3

    if (arguments.length == 3) {
      skip = page * perPage
      limit = perPage
    }

    this
      .find({})
      .limit(limit)
      .skip(skip)
      .sort('created', -1)
      .run(function(err, posts) {
        if (err) {
          throw(err)
        } else {
          loadUsersForPost(posts, callback)
        }
      })
  }

  Post.statics.getByTag = function(tag, callback, page, perPage) {
    var skip = 0
    var limit = 3

    if (arguments.length == 4) {
      skip = page * perPage
      limit = perPage
    }

    this
      .find({ 'tags': tag })
      .limit(limit)
      .skip(skip)
      .sort('created', -1)
      .run(function(err, posts) {
        if (err) {
          throw(err)
        } else {
          var users = {}

          loadUsersForPost(posts, callback)
        }
      })
  }

  Post.statics.getBySlug = function(slug, callback) {
    this.findOne({'slug': slug}, function(err, post) {
      if (err) {
        callback(null, null)
      } else {
        if (post != null) {
          loadUsersForPostWithComments(post, function(post, users) {
            callback(post, users)
          })
        } else {
          callback(null, null)
        }
      }
    })
  }

  Post.statics.getTags = function(callback) {
    this.find({}, function(err, posts) {
      if (!err) {
        var tags = {}

        _.each(posts, function(post, i) {
          _.each(post.tags, function(tag, j) {
            if (typeof tags[tag] == 'undefined')
              tags[tag] = 1
            else
              tags[tag] ++
          })
        })

        callback(tags)
      }
    })
  }

  function slugGenerator (options){
    options = options || {}
    var key = options.key || 'title'

    return function slugGenerator(schema){
      schema.path(key).set(function(v){
        this.slug = new Date().getTime() + "-" + v.toLowerCase().replace(/[^a-z0-9]/g, '-')
        return v
      })
    }
  }

  Post.plugin(slugGenerator())

  mongoose.model('Post', Post)

  function loadUsersForPost(posts, callback) {
    var userIds = []

    _.each(posts, function(post, idx) {
      userIds.push(post.author)
    })

    loadUsersById(userIds, function(users) {
      callback(posts, users)
    })
  }

  function loadUsersForPostWithComments(post, callback) {
    var userIds = []

    userIds.push(post.author)

    _.each(post.comments, function(comment, idx) {
      userIds.push(comment.author)
    })

    loadUsersById(userIds, function(users) {
      callback(post, users)
    })
  }

  function loadUsersById(userIds, callback) {
    mongoose.model('User').find({ _id: { $in : userIds } }, function(err, users) {
      var usersHash = {}

      _.each(users, function(user, idx) {
        usersHash[user._id] = user
      })

      callback(usersHash)
    })
  }
}

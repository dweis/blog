process.env.NODE_ENV = 'testing'

var vows = require('vows')
  , assert = require('assert')
  , request = require('request')
  , app = require('../../app')

app.listen(3090)

const BASE_URI = 'http://localhost:3090/'

vows
  .describe('Posts Controller').addBatch({
      'WHEN I visit the home page': {
        topic: function() {
            request({ uri: BASE_URI,
                      followRedirect: false }, this.callback)
          }
      , 'THEN it should redirect to /posts':
          function(error, response, body) {
            assert.equal(response.statusCode, 301)
            assert.equal(response.headers.location, BASE_URI + 'posts')
          }
      }

    , 'WHEN I visit /posts': {
        topic: function() {
            request({ uri: BASE_URI + 'posts'
                    , followRedirect: false }, this.callback)
          }
      , 'THEN it should render the posts page':
          function(error, response, body) {
            assert.ok(body.match(/<title>Latest posts on/))
          }
      , 'AND the status code should be 200': 
          function(error, response, body) {
            assert.equal(response.statusCode, 200)
          }
      }

    , 'WHEN I request a post which does not exist': {
        topic: function() {
            request({ uri: BASE_URI + 'posts/nonexisting---page--'
                    , followRedirect: false }, this.callback)
          }
      , 'THEN it should render the not found page': 
          function(error, response, body) {
            assert.ok(body.match('Sorry, the page you requested could not be found!'))
          }
      , 'AND the status code should be 404': 
          function(error, response, body) {
            assert.equal(response.statusCode, 404)
          }
      }

    , 'GIVEN a non-authenticated user': {
        'WHEN I request /posts/new': {
          topic: function() {
              request({ uri: BASE_URI + 'posts/new',
                        followRedirect: false }, this.callback)
            }
        , 'THEN it should render a forbidden page':
            function(error, response, body) {
              assert.ok(body.match('Forbidden'))
            }
        , 'AND the status code should be 403':
            function(error, response, body) {
              assert.equal(response.statusCode, 403)
            }
        }
      }
  })

  .export(module)

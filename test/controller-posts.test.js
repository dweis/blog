process.env.NODE_ENV = 'testing'

var mocha = require('mocha')
  , should = require('should')
  , tobi = require('tobi')
  , app = require('../app')
  , browser = tobi.createBrowser(3090, 'localhost')

app.listen(3090)

describe('Posts Controller', function() {
  describe('I visit the home page', function() {
    it('should redirect to /posts', function(done) {
      browser.get('/', function(res, $) {
        res.should.have.status(200)
        $('h1.title').text().should.equal('Blog')
        done()
      })
    })
  })

  describe('I visit /posts', function() {
    it('should redirect to /posts', function(done) {
      browser.get('/', function(res, $) {
        res.should.have.status(200)
        $('h1.title').text().should.equal('Blog')
        done()
      })
    })
  })

  describe('I request a post which does not exist', function() {
    it('should have a status code of 404', function(done) {
      browser.get('/posts/nonexisting--page--', function(res, $) {
        res.should.have.status(404)
        done()
      })
    })

    it('should render the not found page', function(done) {
      browser.get('/posts/nonexisting--page--', function(res, $) {
        $('#content').text().should.equal('Sorry, the page you requested could not be found!')
        done()
      })
    })
  })

  describe('Attempt to create post as a non-authenticated user', function() {
    it('should have a status code of 403', function(done) {
      browser.get('/posts/new', function(res, $) {
        res.should.have.status(403)
        done();
      })
    })
  })
})

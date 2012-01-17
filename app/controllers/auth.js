module.exports = function(app, mongoose) {
  var log = require('logging').from(__filename)
    , User = mongoose.model('User')
    , Admin = mongoose.model('Admin')

  app.get ('/auth/facebook', function(req, res, params) {
    req.authenticate(['facebook'], function(error, authenticated) {
      if(authenticated) {
        var auth_user = req.getAuthDetails().user

        User.findOne({'id': auth_user.id}, function(err, user) {
          if (user != null) {
            user.id = auth_user.id
            user.email = auth_user.email
            user.first_name = auth_user.first_name
            user.last_name = auth_user.last_name
            user.link = auth_user.link
            user.hometown = auth_user.hometown.name
            user.gender = auth_user.gender
            user.timezone = auth_user.timezone

            user.save(function(err){ 
              if (err) log(err)

              req.session.user_id = user._id
            })

            log(['Authenticated[existing]:', req.getAuthDetails()])
          } else {
            user = new User({
                id: auth_user.id
              , email: auth_user.email
              , first_name: auth_user.first_name
              , last_name: auth_user.last_name
              , link: auth_user.link
              , hometown: auth_user.hometown.name
              , gender: auth_user.gender
              , timezone: auth_user.timezone
            })

            user.save(function(err) { 
              if (err) log(err)

              req.session.user_id = user._id
            })

            log(['Authenticated[new]:', req.getAuthDetails()])
          }

          Admin.find({'user_id': auth_user.id}, function(err, docs) {
            if (docs != null && docs.length) {
              req.session.admin = true
            } else {
              req.session.admin = false
            }

            res.writeHead(303, { 'Location': "/" })
            res.end('')
          })
        })
      }
      else {
        res.end('Authentication failed!')
      }
    })
  })

  app.get('/logout', function(req, res, params) {
    log(['Log out:', req.getAuthDetails()])
    req.logout()
    req.session.destroy(function(err) {
        if (err != null) log('Session destroyed')
      })

    res.writeHead(303, { 'Location': "/" })
    res.end('')
  })
}

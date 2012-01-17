exports.loginRequired = function(req, res, callback) {
  if (typeof req.getAuthDetails().user != 'undefined') {
    callback()
  } else {
    res.send(403)
  }
}

exports.adminRequired = function(req, res, callback) {
  if (req.session.admin) {
    callback()
  } else {
    res.send(403)
  }
}

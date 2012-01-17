function NotFound(msg){
  this.name = 'NotFound'
  Error.call(this, msg)
  Error.captureStackTrace(this, arguments.callee)
}

NotFound.prototype.__proto__ = Error.prototype

exports.NotFound = NotFound

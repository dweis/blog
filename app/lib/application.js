function getEnvironment() {
  return (process.env.NODE_ENV ? process.env.NODE_ENV : 'development')
}

exports.getEnvironment = getEnvironment

exports.getConfig = function() {
  return require(__dirname + '/../../config/' + getEnvironment())
}

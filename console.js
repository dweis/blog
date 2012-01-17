var app = require('./app')
  , repl = require('repl')
  , context = repl.start('blog> ').context

context.app = app
context.db = app.db

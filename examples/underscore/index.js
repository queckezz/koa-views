
var session = require('koa-session');
var router = require('koa-route');
var views = require('../../');
var koa = require('koa');
var app = koa();

/**
 * Session.
 */

app.keys = ['secrets'];
app.use(session());

/**
 * Setup views.
 */

app.use(views({
  cache: true,

  map: {
    html: 'underscore'
  }
}));

app.use(function* (next) {
  var n = this.session.views || 0;
  this.session.views = ++n;

  this.locals = {
    session: this.session
  };

  yield this.render('index', {
    user: 'John'
  });
});

app.listen(3000);
console.log('app running on port 3000');

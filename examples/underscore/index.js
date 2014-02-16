
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

views(app, 'html')
  .map('underscore', 'html')

/**
 * Setup locals.
 */

app.use(function* (next) {
  var n = this.session.views || 0;
  this.session.views = ++n;

  this.locals = {
    session: this.session
  };

  // You can define .locals() multiple times and they get added up.
  this.locals = {
    some: 'prop'
  };

  yield next;
})

/**
 * Routes.
 */

app.use(router.get('/', function *(next) {
  this.body = yield this.render('index', { user: 'John' });
}));

/**
 * Listen.
 */

app.listen(3000);
console.log('app running on port 3000');
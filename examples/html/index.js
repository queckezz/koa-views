

var views = require('../../');
var koa = require('koa');
var app = koa();

/**
 * Setup views.
 */

app.use(views());

app.use(function* (next) {
  yield this.render('index');
});

app.listen(3000);
console.log('app running on port 3000');
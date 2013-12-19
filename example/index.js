
var router = require('koa-route');
var views = require('../');
var koa = require('koa');
var app = koa();

app.use(views('./example', 'jade'));

// Routes.

app.use(router.get('/', function *(next) {
  this.body = yield this.render('index');
}));

app.listen(3000);
console.log('app running on port 3000');
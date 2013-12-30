
var router = require('koa-route');
var views = require('../../');
var koa = require('koa');
var app = koa();

// Jade.

app.use(views('.', 'jade'));

// Routes.

app.use(router.get('/jade', function *(next) {
  this.body = yield this.render('index');
}));

// Listen

app.listen(3000);
console.log('app running on port 3000');
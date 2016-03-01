# koa-views

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]

Template rendering middleware for koa.

## Installation

```
$ npm install koa-views@next
```

## Templating engines

As of right now, `koa-views` is using [consolidate](https://github.com/tj/consolidate.js) under the hood.

[List of supported engines](https://github.com/tj/consolidate.js#supported-template-engines)

## Example (koa 2.x)

```js
var views = require('koa-views');

// Must be used before any router is used
app.use(views(__dirname + '/views', {
  map: {
    html: 'underscore'
  }
}));

app.use(async function (ctx, next) {
  ctx.state = {
    session: this.session,
    title: 'app'
  };

  await ctx.render('user', {
    user: 'John'
  });
});
```

For more examples take a look at the [tests](./test/index.js)

## API

#### `views(root, opts)`

* `root`: Where your views are located. All views you `render()` are relative to this path.
* `opts` (optional)
* `opts.extension`: Default extension for your views

```js
// instead of this
yield this.render('user.jade')
// you can
yield this.render('user')
```

* `opts.map`: map extension to an engine

```js
app.use(views(__dirname, { map: {html: 'nunjucks' }}))

// render `user.html` with nunjucks
app.use(async function (ctx) {
  await ctx.render('user.html')
})
```

## Debug

Set the `DEBUG` environment variable to `koa-views` when starting your server.

```bash
$ DEBUG=koa-views
```

## License

[MIT](./license)

[travis-image]: https://img.shields.io/travis/queckezz/koa-views.svg?style=flat-square
[travis-url]: https://travis-ci.org/queckezz/koa-views
[npm-image]: https://img.shields.io/npm/v/koa-views.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-views
[david-image]: http://img.shields.io/david/queckezz/koa-views.svg?style=flat-square
[david-url]: https://david-dm.org/queckezz/koa-views
[license-image]: http://img.shields.io/npm/l/koa-views.svg?style=flat-square
[license-url]: ./license

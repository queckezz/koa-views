# koa-views

[![NPM version][npm-image]][npm-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]

Template rendering middleware for koa.

[Supported template engines](https://github.com/tj/consolidate.js#supported-template-engines)

## Installation

```
$ npm install koa-views
```

## Example

```js
// Must be used before any router is used
app.use(views('views', {
  map: {
    html: 'underscore'
  }
}));

app.use(function* (next) {
  this.state = {
    session: this.session,
    title: 'app'
  };

  yield this.render('user', {
    user: 'John'
  });
});
```

For more examples take a look at the [tests](./test/index.js)

## API

#### `views([root, opts])`

* `root (__dirname)`: __dirname + where your views are located
* `opts`: these options go straight to [co-views](https://github.com/tj/co-views).
  - root: view root directory

## Debug

Set the `DEBUG` environment variable to `koa-views` when starting your server.

```bash
$ DEBUG=koa-views
```

## License

[MIT](./license)

[npm-image]: https://img.shields.io/npm/v/koa-views.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-views
[david-image]: http://img.shields.io/david/queckezz/koa-views.svg?style=flat-square
[david-url]: https://david-dm.org/queckezz/koa-views
[license-image]: http://img.shields.io/npm/l/koa-views.svg?style=flat-square
[license-url]: ./license

# koa-views

![koa-views](https://img.shields.io/github/workflow/status/queckezz/koa-views/koa-views?logo=github&style=flat-square)
[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]

Template rendering middleware for `koa@2`.

## Installation

```sh
npm install koa-views
```

## Templating engines

`koa-views` is using [consolidate](https://github.com/tj/consolidate.js) under the hood.

[List of supported engines](https://github.com/tj/consolidate.js#supported-template-engines)

**NOTE**: you must still install the engines you wish to use, add them to your package.json dependencies.

## Example

```js
var views = require('koa-views');

const render = views(__dirname + '/views', {
  map: {
    html: 'underscore'
  }
})

// Must be used before any router is used
app.use(render)
// OR Expand by app.context
// No order restrictions
// app.context.render = render()

app.use(async function (ctx) {
  ctx.state = {
    session: this.session,
    title: 'app'
  };

  await ctx.render('user', {
    user: 'John'
  });
});
```

For more examples you can take a look at the [tests](./test/index.js).

## Simple middleware

If you need to simply render pages with locals, you can install `koa-views-render`:

```sh
npm install koa-views-render
```

Then simply use it on your routes and its arguments will be passed to `ctx.render`.

```js
var render = require('koa-views-render');

// ...

app.use(render('home', { title : 'Home Page' }));
```

## API

#### `views(root, opts)`

* `root`: Where your views are located. Must be an absolute path. All rendered views are relative to this path
* `opts` (optional)

* `opts.autoRender`: Whether to use `ctx.body` to receive the rendered template string. Defaults to `true`.

```js
const render = views(__dirname, { autoRender: false, extension: 'pug' });
app.use(render)
// OR
// app.context.render = render()

app.use(async function (ctx) {
  return await ctx.render('user.pug')
})
```

vs.

```js
const render = views(__dirname, { extension: 'pug' })
app.use(render)
// OR
// app.context.render = render()

app.use(async function (ctx) {
  await ctx.render('user.pug')
})
```

* `opts.extension`: Default extension for your views

Instead of providing the full file extension you can omit it.
```js
app.use(async function (ctx) {
  await ctx.render('user.pug')
})
```

vs.

```js
const render = views(__dirname, { extension: 'pug' })
app.use(render)
// OR
// app.context.render = render()

app.use(async function (ctx) {
  await ctx.render('user')
})
```

* `opts.map`: Map a file extension to an engine

In this example, each file ending with `.html` will get rendered using the `nunjucks` templating engine.
```js
const render = views(__dirname, { map: {html: 'nunjucks' }})
app.use(render)
// OR
// app.context.render = render()
// render `user.html` with nunjucks
app.use(async function (ctx) {
  await ctx.render('user.html')
})
```

* `opts.engineSource`: replace consolidate as default engine source

If you’re not happy with consolidate or want more control over the engines, you can override it with this options. `engineSource` should
be an object that maps an extension to a function that receives a path and options and returns a promise. In this example templates with the `foo` extension will always return `bar`.

```js
const render = views(__dirname, { engineSource: {foo: () => Promise.resolve('bar')}})
app.use(render)
// OR
// app.context.render = render()

app.use(async function (ctx) {
  await ctx.render('index.foo')
})
```

* `opts.options`: These options will get passed to the view engine. This is the time to add `partials` and `helpers` etc.

```js
const app = new Koa()
  .use(views(__dirname, {
    map: { hbs: 'handlebars' },
    options: {
      helpers: {
        uppercase: (str) => str.toUpperCase()
      },

      partials: {
        subTitle: './my-partial' // requires ./my-partial.hbs
      },
      
      cache: true // cache the template string or not
    }
  }))
  .use(function (ctx) {
    ctx.state = { title: 'my title', author: 'queckezz' }
    return ctx.render('./my-view.hbs')
  })
```

## Debug

Set the `DEBUG` environment variable to `koa-views` when starting your server.

```bash
$ DEBUG=koa-views
```

## License

[MIT](./license)

[npm-image]: https://img.shields.io/npm/v/koa-views.svg?style=flat-square
[npm-downloads-image]: https://img.shields.io/npm/dm/koa-views.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-views
[david-image]: http://img.shields.io/david/queckezz/koa-views.svg?style=flat-square
[david-url]: https://david-dm.org/queckezz/koa-views
[license-image]: http://img.shields.io/npm/l/koa-views.svg?style=flat-square
[license-url]: ./license

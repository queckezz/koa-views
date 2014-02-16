## koa views

Render your views with almost any templating engine.

## Installation

    $ npm install koa-views

## Example

```js
views(app, 'jade')
  .map('underscore', 'html')
  .map('hogan', 'md')
```

After that you can add per-request locals.

```js
app.use(function* (next) {
  this.locals = {
    session: this.session
  };

  yield next;
});
```
And then you can yield to `this.body`.

```js
// Render html with underscore
this.body = yield this.render('index.html', { user: 'John' });

// Render jade
this.body = yield this.render('index', { user: 'Prick' });

// Render markdown with hogan
this.body = yield this.render('index.md');
```

For full examples take a look at the `/examples` folder.

## API

### views(app, [ ,path, ] ext [, opts])

* `app`: Koa instance
* `path`: Path to your views [__dirname]
* `ext`: Default extension name to use when missing
* `opts`: These options go straight to [co-views](https://github.com/visionmedia/co-views)

### .map(engine, extension)

Map `engine` to `ext`.

This is only neccesarry if you want to map an engine to a different extension than the engine name itself.

## Licence

MIT

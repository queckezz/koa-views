## koa views

Render your views with almost any templating engine.

## Installation

    $ npm install koa-views

## Example

```js
views = views(__dirname, 'html')
  .map('underscore', 'html')

app.use(views.use())
```

After you have added `views` to your middleware stack you can start rendering your views.

```js
app.use(function* (next) {
  var n = this.session.views || 0;
  this.session.views = ++n;

  this.locals({
    session: this.session
  });

  yield next;
})

app.use(router.get('/', function *(next) {
  this.body = yield this.render('index', { user: 'John' });
}));
```

For full examples take a look at the `/examples` folder.

## API

### views([path, ] ext [, opts])

* `path`: Path to your views [__dirname]
* `ext`: Default extension name to use when missing
* `opts`: These options go straight to [co-views](https://github.com/visionmedia/co-views)

__Note__: Make sure that you define `views()` before you mount other koa apps.

### #map(engine, extension)

Map `engine` to `ext`.

This is only neccesarry if you want to map an engine to a different extension than the engine name itself.

### #use()

Mount to middleware.

## Licence

MIT

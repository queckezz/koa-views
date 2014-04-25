## koa views

Render views with almost any templating engine.

## Installation

```
$ npm install koa-views
```

## Example

```js
app.use(views('./views', 'jade', {
  html: underscore
}));

app.use(function* (next) {
  this.locals = {
    session: this.session,
    title: 'app'
  };

  console.log(this.locals); // {session: {_id: ...}, title: app}

  // Render html with underscore.
  yield this.render('index.html', {
    user: 'John'
  });

  // Render jade.
  yield this.render('index', {
    user: 'Prick'
  });
});
```

For full examples take a look at the [./examples](./examples) folder.

## API

### views([path, ] ext [, map])

* `path`: Path to your views [__dirname]
* `ext`: Default extension name to use when none specified
* `map`: Map an engine to a extension. This is only necessary if you want to map an engine to a different extension than the engine name itself.

## Licence

MIT

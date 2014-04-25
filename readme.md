## koa views

Render views with almost any templating engine.

## Installation

```
$ npm install koa-views
```

## Example

```js
app.use(views('views', {
  default: 'jade',
  cache: true,

  map: {
    html: underscore
  }
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

### views([path, opts])

* `path (__dirname)`: __dirname + where your views are located
* `opts`: these options go straight to [co-views](https://github.com/visionmedia/co-views).

## Debug

```bash
$ DEBUG=koa-views node --harmony-generators server.js
```

## Licence

MIT

# koa-views

Template rendering middleware for koa, supporting [many](https://github.com/tj/consolidate.js#supported-template-engines) template engines.

## Installation

```
$ npm install koa-views
```

## Example

```js
// Must be used before any router is used
app.use(views('views', {
  map: {
    html: underscore
  }
}));

app.use(function* (next) {
  this.locals = {
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

#### `views([path, opts])`

* `path (__dirname)`: __dirname + where your views are located
* `opts`: these options go straight to [co-views](https://github.com/visionmedia/co-views).

## Debug

```bash
$ DEBUG=koa-views node --harmony-generators server.js
```

## Licence

MIT

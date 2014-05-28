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

## App-wide views

Dependending on your choice of application structure, and to avoid
duplicating code, you may wish to share the same view settings between
all of your application pages. To do this, create a `views.js` module
with your preferred settings:

```js
var views = require('koa-views');

module.exports = function() {
  return views('views', {
    cache: true,
    map: {
      html: 'underscore'
    }
  });
};
```

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

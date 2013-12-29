## koa-render
 
Add a `render()` method to koa that allows you to render almost any templating engine.
 
Extending koa by adding a `render()` method has the advantage that you can define your views settings once and have them available in each of your koa sub-apps.
 
## Installation
 
    $ npm i --save koa-render
 
## Usage
 
### views(path, [ext, map])
 
* `ext`: define the default extension name. Defaults to `html`
* `map`: custom mapping.
 
Use `views` in a koa middleware with given options and yield it to `this.body`.
 
```javascript
// Shorthand
app.use(views('./example', 'jade'));

// Or

app.use(views('./example', {
  html: 'underscore'
}));

// You can use multiple engines too.

app.use(views('./example', 'jade', {
  html: 'underscore',
  jade: 'jade'
}));

// And yield.

app.use(router.get('/', function *(next) {
  this.body = yield this.render('index');
}));
```

__Note__: Make sure that you define `views()` before you mount other koa apps.
 
For a full examples take a look at the ./examples folder.
 
## Licence
 
MIT

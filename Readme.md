## koa-render
 
Add a `render()` method to koa that allows you to render almost any templating engine.
 
Extending koa by adding a `render()` method has the advantage that you can define your views settings once and have them available in each of your koa sub-apps.
 
## Installation
 
    $ npm i --save koa-render
 
## Usage
 
### views(path, engine, [options])
 
Use `views` in a koa middleware with given options and yield it to `this.body`.  Koa-render finds your given template relative to the `path` that you set. `engine` can be any templating engine that is supported by [consolidate.js](https://github.com/visionmedia/consolidate.js)
 
```javascript
app.use(views('./example', 'jade'));
 
app.use(router.get('/', function *(next) {
  this.body = yield this.render('index');
}));
```

__Note__: Make sure that you define `views()` before you mount other koa apps.
 
For a full example take a look at the ./example folder.
 
## Licence
 
MIT
## koa-render
 
Add a `render()` method to koa that allows you to render almost any templating engine.
 
Extending koa by adding a `render()` method has the advantage that you can define your views settings once and have them available throughout your app, even when you `mount()` another app with koa-mount.
 
## Installation
 
    $ npm i --save koa-render
 
## Usage
 
### views(path, [ext, map])
 
* `ext`: define the default extension name. Defaults to `html`
* `map`: custom mapping.
 
Use `views` in a koa middleware with given options and yield it to `this.body`.

If you use an engine that has the same extension as the engine itself you can use a shorthand

```javascript
	app.use(views('./example', 'jade'));
    
    // in your route handler
    this.body = yield this.render('index');
```

otherwise you can `map` an extension to an engine. In this case we map all files with the extension `.html` to underscore.

```javascript
app.use(views('./example', {
  html: 'underscore'
}));

// in your route handler
this.body = yield this.render('index');
```

You can use different engines throughout your app just by mapping different extension names to engines.

```javascript
app.use(views('./example', 'jade', {
  html: 'underscore',
  jade: 'jade'
}));

// route: A (renders index.jade)
this.body = yield this.render('index');

// route: B (renders index.html with underscore)
this.body = yield this.render('index.html');
```

__Note__: Make sure that you define `views()` before you mount other koa apps.
 
For full examples take a look at the examples folder.
 
## Licence
 
MIT

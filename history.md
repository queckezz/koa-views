
## 3.0.0

* _Breaking_: `this.locals` is now `this.state`
* return and yield next if this.render already exists

# 2.1.2

* support default to ./index.[ext]

# 2.0.3

* Resolves circular dependencies in `this.locals`

## 2.0.0 / 4.28.2014

* default extension to .html
* better debug messages
* move default ext to options
* name middleware
* change locals behavior so they don't get set twice
* fix path confusion, hopefully.

## 1.2.0 / 2.22.2014

 * use middleware instead of direct app reference
 * `this.body = yield this.render()` -> `yield this.render()`

## 1.1.0 / 2.16.2014

 * Use a koa instance to extend koa itself instead of adding a each method on every request.
 * `this.locals =` instead of `this.locals()`

## 1.0.0 / 2.15.2014

 * Renamed project from `koa-render` to `koa-views`.
 * added `this.locals()` for per-request locals.
 * refactored API
 * more descriptive debug messages.

## 0.1.0 / 12.19.2013

 * Allowing using extension different than engine's shortname.

## 0.0.1 / 12.19.2013

 * Initial commit.
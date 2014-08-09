
/**
 * Module dependencies.
 */

var debug = require('debug')('koa-views');
var resolve = require('path').resolve;
var dirname = require('path').dirname;
var fmt = require('util').format;
var merge = require('deepmerge');
var join = require('path').join;
var cons = require('co-views');
var send = require('koa-send');

/**
 * Add `render` method and define `locals` getter and
 * setters.
 *
 * @param {String} path (optional)
 * @param {Object} opts (optional)
 * @api public
 */

module.exports = function (path, opts) {
  var base = dirname(module.parent.filename)

  // set path relative to the directory the function was called + path
  if (!path || typeof path == 'object') {
    opts = path;
    path = base;
  } else {
    path = resolve(base, path);
  }

  if (!opts) opts = {};

  // default extension to `html`
  if (!opts.default) opts.default = 'html';

  for (var prop in opts) {
    var opt = opts[prop];
    if (opt == opts.map) opt = JSON.stringify(opt);
    debug(fmt('set `%s` to `%s`', prop, opt));
  }

  return function *views (next) {
    if (this.locals && this.render) return;

    /**
     * App-specific `locals`, but honor upstream
     * middlewares that may have already set this.locals.
     */

    this.locals = this.locals || {};

    /**
     * Render `view` with `locals`.
     *
     * @param {String} view
     * @param {Object} locals
     * @return {GeneratorFunction}
     * @api public
     */

    this.render = function *(view, locals) {
      if (!locals) locals = {};
      locals = merge(locals, this.locals);
      var ext = opts.default;
      var file = fmt('%s.%s', view, ext);
      debug(fmt('render `%s` with %j', file, locals));

      if (ext == 'html' && !opts.map) {
        yield send(this, join(path, file));
      } else {
        var render = cons(path, opts);
        this.body = yield render(view, locals);
      }

      this.type = 'text/html';
    }

    yield next;
  }
}

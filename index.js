
/**
 * Module dependencies.
 */

var debug = require('debug')('koa-render');
var relative = require('path').relative;
var dirname = require('path').dirname;
var views = require('co-views');

/**
 * Export `Views`.
 */

module.exports = Views;

/**
 * Views constructor.
 *
 * @param {String} path (optional)
 * @param {String} ext
 * @param {Object} opts
 */

function Views (path, ext, opts) {
  if (!(this instanceof Views)) return new Views(path, ext, opts);
  if (!opts) opts = {};

  if (typeof ext == 'object' || typeof ext == 'undefined') {
    ext = path;
    path = dirname(module.parent.filename);
  }

  debug('path `%s`', relative(process.cwd(), path));
  debug('options `%s`', JSON.stringify(opts));

  opts.default = ext;
  this.path = path;
  this.opts = opts;
  this.locals = {};
}

/**
 * Map `engine` to `ext`.
 * This is only neccesarry if you want to map an engine to
 * a different extension than the engine name itself.
 *
 * @param {String} engine
 * @param {String} ext
 * @api public
 */

Views.prototype.map = function (engine, ext) {
  debug('map `%s` to `%s`', engine, ext);
  if (!this.opts.map) this.opts.map = {};
  this.opts.map[ext] = engine;
  return this;
};

/**
 * Use `Views` in a middleware.
 * This adds two new methods to koa's ctx:
 *
 *  - this.render() renders a views.
 *  - this.locals() per request locals.
 *
 * @api public
 */

Views.prototype.use = function () {
  var self = this;
  var cons = views(this.path, this.opts);

  return function* (next) {
    // Add methods to koa's `ctx`
    this.locals = locals.bind(self);
    this.render = render.bind(self);
    yield next;
  };

  function locals (locals) {
    this.locals = merge(this.locals, locals);
  }

  function render (file, locals) {
    locals = merge(this.locals, locals);
    return cons(file, locals);
  }
};

/**
 * Merge `a` with `b`
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 */

function merge (a, b) {
  for (var k in b) a[k] = b[k];
  return a;
}
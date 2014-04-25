
/**
 * Module dependencies.
 */

var debug = require('debug')('koa-views');
var merge = require('merge-descriptors');
var resolve = require('path').resolve;
var dirname = require('path').dirname;
var delegate = require('delegates');
var join = require('path').join;
var cons = require('co-views');

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
  if (!path || typeof path == 'object') path = base;
  else path = resolve(base, path);

  if (!opts) opts = {};

  debug('path `%s`', path);
  debug('map `%s`', JSON.stringify(opts.map));

  return function *views (next) {
    if (this.locals && this.render) return;

    /**
     * App-specific `locals`.
     */

    this.locals = {}

    /**
     * Render `view` with `locals`.
     *
     * @param {String} view
     * @param {Object} locals
     * @return {GeneratorFunction}
     * @api public
     */

    this.render = function (view, locals) {
      if (!locals) locals = {};
      merge(locals, this.locals);

      var render = cons(path, opts);

      return function *() {
        debug('render `%s.%s` with %s', view, opts.default, JSON.stringify(locals));
        this.body = yield render(view, locals);
      }
    }

    yield next;
  }
}

/**
 * merge obj `a` with `b`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

function merge (a, b) {
  for (var k in b) a[k] = b[k];
  return a;
}
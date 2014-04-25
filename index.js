
/**
 * Module dependencies.
 */

var debug = require('debug')('koa-views');
var merge = require('merge-descriptors');
var relative = require('path').relative;
var dirname = require('path').dirname;
var delegate = require('delegates');
var cons = require('co-views');

/**
 * Add `render` method and define `locals` getter and
 * setters.
 *
 * @param {String} path (optional)
 * @param {String} ext
 * @param {Object} map (optional)
 * @api public
 */

module.exports = function (path, ext, map) {
  if (typeof ext == 'object' || !ext) {
    map = ext;
    ext = path;
    path = dirname(module.parent.filename);
  }

  if (!map) map = {};

  debug('path `%s`', relative(process.cwd(), path));
  debug('map `%s`', JSON.stringify(map));

  return function *views (next) {
    if (this.locals && this.response) return;

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

      var render = cons(path, {
        default: ext,
        map: map
      });

      return function *() {
        debug('render `%s.%s` with %s', view, ext, JSON.stringify(locals));
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
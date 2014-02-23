
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
 * Exports `views`.
 */

module.exports = views;

/**
 * Add `render` method and define `locals` getter and
 * setters.
 *
 * @param {String} path (optional)
 * @param {String} ext
 * @param {Object} map (optional)
 * @api public
 */

function views(path, ext, map) {
  if (typeof ext == 'object' || !ext) {
    map = ext;
    ext = path;
    path = dirname(module.parent.filename);
  }

  if (!map) map = {};

  debug('path `%s`', relative(process.cwd(), path));
  debug('map `%s`', JSON.stringify(map));

  return function* (next) {
    var res = this.app.response;
    var ctx = this.app.context;
    if (res.render && ctx.locals) return;

    this._locals = {};

    merge(ctx, {
      /**
       * Get locals.
       *
       * @return {Object} locals
       * @api public
       */

      get locals() {
        return this._locals;
      },

      /**
       * Extend req locals with new locals.
       *
       * @param {Object} locals
       * @api public
       */

      set locals(locals) {
        combine(this._locals, locals);
        debug('set locals to %s', JSON.stringify(this._locals));
      }
    });

    /**
     * Render `view` with `locals`.
     *
     * @param {String} view
     * @param {Object} locals
     * @return {GeneratorFunction}
     * @api public
     */

    res.render = function (view, locals) {
      if (!locals) locals = {};
      combine(locals, this.ctx.locals);

      var render = cons(path, {
        default: ext,
        map: map
      });

      return function* () {
        debug('render `%s.%s` with %s', view, ext, JSON.stringify(locals));
        this.body = yield render(view, locals);
      }
    };

    /**
     * Delegate `res.render()` to this.ctx.
     */

    delegate(ctx, 'response')
      .method('render');

    yield next;
  }
}

/**
 * combine obj `a` with `b`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object}
 * @api private
 */

function combine (a, b) {
  for (var k in b) a[k] = b[k];
  return a;
}
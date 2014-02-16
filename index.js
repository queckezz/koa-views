
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
 * Exports
 *
 * @param {Object} app
 * @param {String} path (optional)
 * @param {String} ext
 * @param {Object} opts (optional)
 */

module.exports = function (app, path, ext, opts) {
  var views = new Views(path, ext, opts);
  var locals = {};

  merge(app.context, {

    /**
     * Get locals.
     *
     * @return {Object} locals
     * @api public
     */

    get locals() {
      return locals;
    },

    /**
     * Extend `locals` with `obj`
     *
     * @param {Object} obj
     * @api public
     */

    set locals(obj) {
      combine(locals, obj);
      debug('set locals to %s', JSON.stringify(locals));
    }
  });

  /**
   * Render `file` with `obj`.
   *
   * @param {String} file
   * @param {Object} obj
   * @api public
   */

  app.response.render = function (file, obj) {
    var render = cons(views.path, views.opts);
    combine(obj, locals);
    return render(file, obj);
  };

  /**
   * Delegate `res.render()` to context.
   */

  delegate(app.context, 'response')
    .method('render')

  return views;
};

/**
 * Views constructor.
 *
 * @param {String} path (optional)
 * @param {String} ext
 * @param {Object} opts (optional)
 * @api public
 */

function Views (path, ext, opts) {

  if (typeof ext == 'object' || typeof ext == 'undefined') {
    opts = ext;
    ext = path;
    path = dirname(module.parent.filename);
  }

  if (!opts) opts = {};

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
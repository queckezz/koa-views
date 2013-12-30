/**
 * Module dependencies.
 */

var debug = require('debug')('koa-render');
var view = require('co-views');

/**
 * Expose `render()`.
 */

module.exports = render;

/**
 * Expose a `render()` method to koa's context.
 *
 * @param {String} path
 * @param {String} ext (optional)
 * @param {Object} custom map (optional)
 * @return {Function} middleware
 * @api public
 */

function render(path, ext, map) {
  var opts = {};

  if (map) {
    opts.map = map;
    opts.ext = ext;
  }

  if (typeof ext === 'object') opts.map = ext;
  else opts.ext = ext;

  return function *views(next) {
    this.render = view(path, opts);
    debug('add render() function');

    yield next;
  }
}

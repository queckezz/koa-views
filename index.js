/**
 * Module dependencies.
 */

var views = require('co-views');

/**
 * Expose `render()`.
 */

module.exports = render;

/**
 * Expose a `render()` method to koa.
 *
 * @param {String} path
 * @param {String} ext [optional]
 * @param {Object} custom map [optional]
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

  return function *renderView(next) {
    this.render = views(path, opts);

    yield next;
  }
}

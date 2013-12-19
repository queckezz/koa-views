
/**
 * Module dependencies.
 */

var views = require('co-views')

/**
 * Expose `render()`.
 */

module.exports = render;

/**
 * Expose a `render()` method to Koa's context.
 *
 * @param {String} path
 * @param {String} engine
 * @param {Object} opts
 * @return {Function} Middleware
 * @api public
 */

function render(path, engine, opts) {
  opts = opts || {};

  return function *(next) {
    opts.ext = engine
    this.render = views(path, opts)

    yield next
  }
}
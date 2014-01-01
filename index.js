
/**
 * Module dependencies.
 */

var debug = require('debug')('koa-render');
var view = require('co-views');
var merge = require('merge');

/**
 * Expose a `render()` method to koa's context.
 *
 * @param {String} path
 * @param {String} ext (optional)
 * @param {Object} opts (optional)
 * 
 * @return {Function} middleware
 * @api public
 */

module.exports = function (path, ext, opts) {
  debug('add render() function');
  opts = opts || {}

  if (typeof ext === 'object') opts = ext;
  else opts.ext = ext;

  // get render function
  render = render(path, opts)

  // middleware
  return function *views(next) {
    this.render = render;

    yield next;
  }
}

/**
 * Generates a `co-views` fn with global
 * locals as parameter
 * 
 * @param {String} path
 * @param {Object} opts
 * 
 * @return {Generator} view
 */

function render (path, opts) {
  if (!opts.locals) return view(path, opts);

  return function (file, locals) {

    // merge global with local locals.
    locals = merge(opts.locals, locals);

    delete opts.locals;
    view = view(path, opts);
    debug('render %s with locals %j and options %j', file, locals, opts);

    return view(file, locals);
  }
}
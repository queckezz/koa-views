'use strict';

/**
 * Module dependencies.
 */

var debug = require('debug')('koa-views');
var defaults = require('@f/defaults');
var fmt = require('util').format;
var join = require('path').join;
var cons = require('co-views');
var send = require('koa-send');

/**
 * Check if `ext` is html.
 * @return {Boolean}
 */

const isHtml = ext => ext == 'html'

/**
 * Add `render` method.
 *
 * @param {String} path
 * @param {Object} opts (optional)
 * @api public
 */

module.exports = (path, opts) => {
  opts = defaults(opts || {}, {
    default: 'html'
  })

  debug('options: %j', opts);

  return function *views (next) {
    if (this.render) return yield next;
    var render = cons(path, opts);

    /**
     * Render `view` with `locals` and `koa.ctx.state`.
     *
     * @param {String} view
     * @param {Object} locals
     * @return {GeneratorFunction}
     * @api public
     */

     Object.assign(this, {
       render: function *(view, locals) {
         var ext = opts.default;
         if(view[view.length - 1] === '/') view += 'index';
         var file = fmt('%s.%s', view, ext);
         var state = locals && this.state ? Object.assign(locals, this.state) : {};
         debug('render `%s` with %j', file, state);
         this.type = 'text/html';

         if (isHtml(ext) && !opts.map) {
           yield send(this, file, {
             root: path
           });
         } else {
           this.body = yield render(view, state);
         }

       }
     })

    yield next;
  }
}


'use strict'

/**
* Module dependencies.
*/

const debug = require('debug')('koa-views')
const defaults = require('@f/defaults')
const dirname = require('path').dirname
const extname = require('path').extname
const join = require('path').join
const resolve = require('path').resolve
const send = require('koa-send')
const _stat = require('fs').stat
const consolidate = require('consolidate')

/**
* Check if `ext` is html.
* @return {Boolean}
*/

const isHtml = (ext) => ext === 'html'

/**
 * File formatter.
 */

const toFile = (fileName, ext) => `${fileName}.${ext}`

/**
 * `fs.stat` promisfied.
 */

const stat = (path) => {
  return new Promise((resolve, reject) => {
    _stat(path, (err, stats) => {
      if (err) reject(err)
      resolve(stats)
    })
  })
}

/**
 * Get the right path, respecting `index.[ext]`.
 * @param  {String} abs absolute path
 * @param  {String} rel relative path
 * @param  {String} ext File extension
 * @return {Object} tuple of { abs, rel }
 */

function getPaths(abs, rel, ext) {
  return stat(join(abs, rel)).then((stats) => {
    if (stats.isDirectory()) {
      // a directory
      return {
        rel: join(rel, toFile('index', ext)),
        abs: join(abs, dirname(rel), rel)
      }
    }

    // a file
    return {
      rel,
      abs
    }
  })
  .catch((e) => {
    // not a valid file/directory
    if (!extname(rel)) {
      // Template file has been provided without extension
      // so append to it to try another lookup
      return getPaths(abs, `${rel}.${ext}`, ext)
    }

    throw e
  })
}

/**
 * Add `render` method.
 *
 * @param {String} path
 * @param {Object} opts (optional)
 * @api public
 */
module.exports = (path, opts) => {
  opts = defaults(opts || {}, {
    extension: 'html'
  })

  debug('options: %j', opts)

  return function views (ctx, next) {
    if (ctx.render) return next()

    /**
     * Render `view` with `locals` and `koa.ctx.state`.
     *
     * @param {String} view
     * @param {Object} locals
     * @return {GeneratorFunction}
     * @api public
     */
    ctx.render = function (relPath, locals) {
      if (locals == null) {
        locals = {}
      }

      let ext = (extname(relPath) || '.' + opts.extension).slice(1)

      return getPaths(path, relPath, ext)
      .then((paths) => {
        const state = ctx.state ? Object.assign(locals, ctx.state) : locals
        debug('render `%s` with %j', paths.rel, state)
        ctx.type = 'text/html'

        if (isHtml(ext) && !opts.map) {
          return send(ctx, paths.rel, {
            root: path
          })
        } else {
          let engineName = ext

          if (opts.map && opts.map[ext]) {
            engineName = opts.map[ext]
          }

          if (!engineName) {
            return Promise.reject(new Error(`Engine not found for file ".${ext}" file extension`))
          }

          return consolidate[engineName](resolve(paths.abs, paths.rel), state)
          .then((html) => {
            ctx.body = html
          })
        }
      })
    }

    return next()
  }
}

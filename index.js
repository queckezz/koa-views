
'use strict'

const { resolve, dirname, extname, join } = require('path')
const debug = require('debug')('koa-views')
const consolidate = require('consolidate')
const defaults = require('@f/defaults')
const { stat } = require('mz/fs')
const send = require('koa-send')

module.exports = viewsMiddleware

function viewsMiddleware (path, opts) {
  opts = defaults(opts || {}, {
    extension: 'html'
  })

  debug('options: %j', opts)

  return function views (ctx, next) {
    if (ctx.render) return next()

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

function isHtml (ext) {
  return ext === 'html'
}

function toFile (fileName, ext) {
  return `${fileName}.${ext}`
}

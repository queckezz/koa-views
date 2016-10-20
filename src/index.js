
'use strict'

const { resolve, dirname, extname, join } = require('path')
const debug = require('debug')('koa-views')
const consolidate = require('consolidate')
const { stat } = require('mz/fs')
const send = require('koa-send')

module.exports = viewsMiddleware

function viewsMiddleware (path, {
  engineSource = consolidate,
  extension = 'html',
  options = {},
  map
} = {}) {
  return function views (ctx, next) {
    if (ctx.render) return next()

    ctx.render = function (relPath, locals = {}) {
      extension = (extname(relPath) || '.' + extension).slice(1)

      return getPaths(path, relPath, extension)
        .then((paths) => {
          const state = Object.assign(locals, options, ctx.state || {})
          debug('render `%s` with %j', paths.rel, state)
          ctx.type = 'text/html'

          if (isHtml(extension) && !map) {
            return send(ctx, paths.rel, {
              root: path
            })
          } else {
            const engineName = map && map[extension]
              ? map[extension]
              : extension

            const render = engineSource[engineName]

            if (!engineName || !render) return Promise.reject(new Error(
              `Engine not found for the ".${extension}" file extension`
            ))

            return render(resolve(paths.abs, paths.rel), state)
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
    return { rel, abs }
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


'use strict'

const { resolve, extname, join } = require('path')
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
      return getPaths(path, relPath, extension)
        .then((paths) => {
          const suffix = paths.ext
          const state = Object.assign(locals, options, ctx.state || {})
          // deep copy partials
          state.partials = Object.assign({}, options.partials || {})
          debug('render `%s` with %j', paths.rel, state)
          ctx.type = 'text/html'

          if (isHtml(suffix) && !map) {
            return send(ctx, paths.rel, {
              root: path
            })
          } else {
            const engineName = map && map[suffix]
              ? map[suffix]
              : suffix

            const render = engineSource[engineName]

            if (!engineName || !render) return Promise.reject(new Error(
              `Engine not found for the ".${suffix}" file extension`
            ))

            return render(resolve(path, paths.rel), state)
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
        ext: ext
      }
    }

    // a file
    return { rel, ext: extname(rel).slice(1) }
  })
  .catch((e) => {
    // not a valid file/directory
    if (!extname(rel) || extname(rel).slice(1) !== ext) {
      // Template file has been provided without the right extension
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

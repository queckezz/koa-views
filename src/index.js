'use strict'

const { resolve } = require('path')
const debug = require('debug')('koa-views')
const consolidate = require('consolidate')
const send = require('koa-send')
const getPaths = require('get-paths')
const pretty = require('pretty')

module.exports = viewsMiddleware

const bigIntReplacer = () => {
  const seen = new WeakSet()
  return (key, value) => {
    if (typeof value === 'bigint') return value.toString()

    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return
      }
      seen.add(value)
    }

    return value
  }
}

function viewsMiddleware(
  path,
  { autoRender = true, engineSource = consolidate, extension = 'html', options = {}, map } = {}
) {
  return function views(ctx, next) {
    if (ctx.render) return next()

    ctx.response.render = ctx.render = function(relPath, locals = {}) {
      return getPaths(path, relPath, extension).then(paths => {
        const suffix = paths.ext
        const state = Object.assign(locals, options, ctx.state || {})
        // deep copy partials
        state.partials = Object.assign(Object.create(null), options.partials || {})
        debug('render `%s` with %s', paths.rel, JSON.stringify(state, bigIntReplacer()))
        ctx.type = 'text/html'

        if (isHtml(suffix) && !map) {
          return send(ctx, paths.rel, {
            root: path
          })
        } else {
          const engineName = map && map[suffix] ? map[suffix] : suffix

          const render = engineSource[engineName]

          if (!engineName || !render)
            return Promise.reject(
              new Error(`Engine not found for the ".${suffix}" file extension`)
            )

          return render(resolve(path, paths.rel), state).then(html => {
            // since pug has deprecated `pretty` option
            // we'll use the `pretty` package in the meanwhile
            if (locals.pretty) {
              debug('using `pretty` package to beautify HTML')
              html = pretty(html)
            }

            if (autoRender) {
              ctx.body = html
            } else {
              return Promise.resolve(html)
            }
          })
        }
      })
    }

    return next()
  }
}

function isHtml(ext) {
  return ext === 'html'
}

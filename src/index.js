'use strict'

const debug = require('debug')('koa-views')
const consolidate = require('consolidate')
const send = require('koa-send')
const getPaths = require('get-paths')
const pretty = require('pretty')
const resolve = require('resolve-path')

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
    let extendsContext = false

    async function render(relPath, locals = {}) {
      if (extendsContext) {
        if (this.ctx && this.ctx.req === this.req) ctx = this.ctx
        else ctx = this
      }

      const paths = await getPaths(path, relPath, extension)

      const suffix = paths.ext
      const state = Object.assign({}, options, ctx.state || {}, locals)
      // deep copy partials
      state.partials = Object.assign(Object.create(null), options.partials || {})
      if (debug.enabled) debug('render `%s` with %s', paths.rel, JSON.stringify(state, bigIntReplacer()))
      ctx.type = 'text/html'

      if (isHtml(suffix) && !map) {
        return send(ctx, paths.rel, {
          root: path
        })
      } else {
        const engineName = map && map[suffix] ? map[suffix] : suffix

        const render = engineSource[engineName]

        if (!engineName || !render)
          throw new Error(`Engine not found for the ".${suffix}" file extension`)

        let html = await render(resolve(path, paths.rel), state)

        // support layout template files
        if (state.layout) {
          const layoutPaths = await getPaths(path, state.layout, extension)
          state.body = html
          html = await render(resolve(path, layoutPaths.rel), state)
        }

        // since pug has deprecated `pretty` option
        // we'll use the `pretty` package in the meanwhile
        if (locals.pretty) {
          debug('using `pretty` package to beautify HTML')
          html = pretty(html)
        }

        if (autoRender) {
          ctx.body = html
        }

        return html
      }
    }

    // Use to extends app.context
    if (!ctx) {
      extendsContext = true
      return render
    }

    if (ctx.render) return next()

    ctx.response.render = ctx.render = render

    return next()
  }
}

function isHtml(ext) {
  return ext === 'html'
}

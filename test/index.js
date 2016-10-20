
const request = require('supertest')
const views = require('../src')
const Koa = require('koa')
require('should')

describe('koa-views', function () {
  it('have a render method', function (done) {
    const app = new Koa()
    .use(views())
    .use(function (ctx) {
      ctx.render.should.ok
      ctx.render.should.Function
    })

    request(app.listen()).get('/')
      .expect(404, done)
  })

  it('default to html', function (done) {
    const app = new Koa()
    .use(views(__dirname))
    .use(function (ctx) {
      return ctx.render('./fixtures/basic')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:html/)
      .expect(200, done)
  })

  it('default to [ext] if a default engine is set', function (done) {
    const app = new Koa()
    .use(views(__dirname, { extension: 'pug' }))
    .use(function (ctx) {
      return ctx.render('./fixtures/basic')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:jade/)
      .expect(200, done)
  })

  it('set and render state', function (done) {
    const app = new Koa()
    .use(views(__dirname, { extension: 'pug' }))
    .use(function (ctx) {
      ctx.state.engine = 'pug'
      return ctx.render('./fixtures/global-state')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:pug/)
      .expect(200, done)
  })

  // #25
  it('works with circular references in state', function (done) {
    const app = new Koa()
    .use(views(__dirname, { extension: 'pug' }))
    .use(function (ctx) {
      ctx.state = {
        a: {},
        app: app
      }

      ctx.state.a.a = ctx.state.a

      return ctx.render('./fixtures/global-state', {
        app: app,
        b: this.state,
        engine: 'pug'
      })
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:pug/)
      .expect(200, done)
  })

  it('`map` given `engine` to given file `ext`', function (done) {
    const app = new Koa()
    .use(views(__dirname, { map: {html: 'underscore'} }))
    .use(function (ctx) {
      ctx.state.engine = 'underscore'
      return ctx.render('./fixtures/underscore')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:underscore/)
      .expect(200, done)
  })

  it('merges global and local state ', function (done) {
    const app = new Koa()
    .use(views(__dirname, { extension: 'pug' }))
    .use(function (ctx) {
      ctx.state.engine = 'pug'

      return ctx.render('./fixtures/state', {
        type: 'basic'
      })
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:pug/)
      .expect(200, done)
  })

  it('call to the next middleware if this.render is already defined', function (done) {
    const app = new Koa()
    .use(function (ctx, next) {
      ctx.render = true
      return next()
    })
    .use(views())
    .use(function (ctx) {
      ctx.body = 'hello'
    })

    request(app.listen()).get('/')
      .expect('hello')
      .expect(200, done)
  })

  it('allows view options to be passed in', function (done) {
    const app = new Koa()
      .use(views(__dirname, {
        map: { hbs: 'handlebars' },
        options: {
          helpers: {
            uppercase: (str) => str.toUpperCase()
          },

          partials: {
            subTitle: './view-options-partial'
          }
        }
      }))
      .use(function (ctx) {
        ctx.state = { title: 'my title', author: 'queckezz' }
        return ctx.render('./fixtures/view-options.hbs')
      })

    request(app.listen()).get('/')
      .expect(/MY TITLE/)
      .expect(200, done)
  })

  // #23 && #27
  it('given a directory it should try to require index.[ext]', function (done) {
    const app = new Koa()
    .use(views(__dirname))
    .use(function (ctx) {
      return ctx.render('./fixtures')
    })

    request(app.listen()).get('/')
      .expect(/defaults-to-index/)
      .expect(200, done)
  })

  // #43
  it('it should not overwrite an extension when given one', function (done) {
    const app = new Koa()
    .use(views(__dirname))
    .use(function (ctx) {
      return ctx.render('./fixtures/basic.ejs')
    })

    request(app.listen()).get('/')
      .expect(/basic:ejs/)
      .expect(200, done)
  })

  it('it should use an engineSource other than consolidate when provided', function(done) {
    const app = new Koa()
        .use(views(__dirname, {
          engineSource: {
            'foo': () => Promise.resolve('hello')
          }
        }))
        .use(function (ctx) {
          return ctx.render('./fixtures/basic.foo')
        })

    request(app.listen()).get('/')
        .expect(/hello/)
        .expect(200, done)
  })
})

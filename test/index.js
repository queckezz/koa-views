
var request = require('supertest')
var views = require('../')
var should = require('should')
var koa = require('koa')

describe('koa-views', function () {
  it('have a render method', function (done) {
    var app = koa()
    .use(views())
    .use(function *() {
      this.render.should.ok
      this.render.should.Function
    })

    request(app.listen()).get('/')
      .expect(404, done)
  })

  it('default to html', function (done) {
    var app = koa()
    .use(views(__dirname))
    .use(function *() {
      yield this.render('./fixtures/basic')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:html/)
      .expect(200, done)
  })

  it('default to [ext] if a default engine is set', function (done) {
    var app = koa()
    .use(views(__dirname, { extension: 'jade' }))
    .use(function *() {
      yield this.render('./fixtures/basic')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:jade/)
      .expect(200, done)
  })

  it('set and render state', function (done) {
    var app = koa()
    .use(views(__dirname, { extension: 'jade' }))
    .use(function *() {
      this.state.engine = 'jade'
      yield this.render('./fixtures/global-state')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:jade/)
      .expect(200, done)
  })

  // #25
  it('works with circular references in state', function (done) {
    var app = koa()
    .use(views(__dirname, { extension: 'jade' }))
    .use(function *() {
      this.state = {
        a: {},
        app: app
      }

      this.state.a.a = this.state.a

      yield this.render('./fixtures/global-state', {
        app: app,
        b: this.state,
        engine: 'jade'
      })
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:jade/)
      .expect(200, done)
  })

  it('`map` given `engine` to given file `ext`', function (done) {
    var app = koa()
    .use(views(__dirname, { map: {html: 'underscore'} }))
    .use(function *() {
      this.state.engine = 'underscore'
      yield this.render('./fixtures/underscore')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:underscore/)
      .expect(200, done)
  })

  it('merges global and local state ', function (done) {
    var app = koa()
    .use(views(__dirname, { extension: 'jade' }))
    .use(function *() {
      this.state.engine = 'jade'

      yield this.render('./fixtures/state', {
        type: 'basic'
      })
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:jade/)
      .expect(200, done)
  })

  it('yields to the next middleware if this.render is already defined', function (done) {
    var app = koa()
    .use(function *(next) {
      this.render = true
      yield next
    })
    .use(views())
    .use(function *() {
      this.body = 'hello'
    })

    request(app.listen()).get('/')
      .expect('hello')
      .expect(200, done)
  })

  // #23 && #27
  it('given a directory it should try to require index.[ext]', function (done) {
    var app = koa()
    .use(views(__dirname))
    .use(function *() {
      yield this.render('./fixtures')
    })

    request(app.listen()).get('/')
      .expect(/defaults-to-index/)
      .expect(200, done)
  })

  // #43
  it('it should not overwrite an extension when given one', function (done) {
    var app = koa()
    .use(views(__dirname))
    .use(function *() {
      yield this.render('./fixtures/basic.ejs')
    })

    request(app.listen()).get('/')
      .expect(/basic:ejs/)
      .expect(200, done)
  })
})

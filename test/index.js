
var request = require('supertest')
var views = require('../')
var should = require('should')
var koa = require('koa')

describe('koa-views', function () {
  it('have a render method', function (done) {
    var app = koa()
    .use(views('test'))
    .use(function *() {
      this.render.should.ok
      this.render.should.Function
    })

    request(app.listen()).get('/')
      .expect(404, done)
  })

  it('default to html', function (done) {
    var app = koa()
    .use(views('test'))
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
    .use(views('test', { default: 'jade' }))
    .use(function *() {
      yield this.render('./fixtures/basic')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:jade/)
      .expect(200, done)
  })

  it('set and render locals', function (done) {
    var app = koa()
    .use(views('test', { default: 'jade' }))
    .use(function *() {
      this.locals.engine = 'jade'
      yield this.render('./fixtures/global-locals')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:jade/)
      .expect(200, done)
  })

  // #25
  it('works with circular references in locals', function (done) {
    var app = koa()
    .use(views('test', { default: 'jade' }))
    .use(function *() {
      this.locals = {
        a: {},
        app: app
      }

      this.locals.a.a = this.locals.a

      yield this.render('./fixtures/global-locals', {
        app: app,
        b: this.locals,
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
    .use(views('test', { map: {html: 'underscore'} }))
    .use(function *() {
      this.locals.engine = 'underscore'
      yield this.render('./fixtures/underscore')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:underscore/)
      .expect(200, done)
  })

  it('merge global and local locals ', function (done) {
    var app = koa()
    .use(views('test', { default: 'jade' }))
    .use(function *() {
      this.locals.engine = 'jade'

      yield this.render('./fixtures/locals', {
        type: 'basic'
      })
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/basic:jade/)
      .expect(200, done)
  })

  // TODO: #23
})
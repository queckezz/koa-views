
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
    .use(views())
    .use(function *() {
      yield this.render('./fixtures/basic')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/<p>basic:html<\/p>/)
      .expect(200, done)
  })

  it('default to [ext] if a default engine is set', function (done) {
    var app = koa()
    .use(views({ default: 'jade' }))
    .use(function *() {
      yield this.render('./fixtures/basic')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/<p>basic:jade<\/p>/)
      .expect(200, done)
  })

  it('set and render locals', function (done) {
    var app = koa()
    .use(views({ default: 'jade' }))
    .use(function *() {
      this.locals.engine = 'jade'
      yield this.render('./fixtures/locals')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/<p>basic:jade<\/p>/)
      .expect(200, done)
  })

  it('`map` given `engine` to given file `ext`', function (done) {
    var app = koa()
    .use(views({ map: {html: 'underscore'} }))
    .use(function *() {
      this.locals.engine = 'underscore'
      yield this.render('./fixtures/underscore')
    })

    request(app.listen()).get('/')
      .expect('Content-Type', /html/)
      .expect(/<p>basic:underscore<\/p>/)
      .expect(200, done)
  })
  
  // TODO: #23
})
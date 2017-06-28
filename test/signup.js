var path = require('path')
var assert = require('assert')
var request = require('supertest')
var app = require('../index')
var User = require('../lib/mongo').User

describe('signup', function () {

  describe('POST /signup', function () {
    var agent = request.agent(app) // 跳转时保存cookie
    beforeEach(function (done) {
      // 用户创建
      User.create({
        name:'aaa',
        password: '123456',
        avatar: '',
        gender:'x',
        bio: ''
      })
      .exec()
      .then(function () {
        done()
      })
      .catch(done)

    })
    afterEach(function (done) {
      User.remove({})
        .exec()
        .then(function () {
          done()
        })
        .catch(done)
    })

    it('wrong name', function (done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.jpg'))
        .field({name: ''})
        .redirects()
        .end(function (err, res) {
          if (err) {
            return done(err)
          }
          assert(res.text.match(/名字请限制在 1-10 个字符/))
          done()
        })

    })
    // 性别错误的情况
    it('wrong gender', function(done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.jpg'))
        .field({ name: 'aaa', gender: 'a' })
        .redirects()
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.text.match(/性别只能是 m、f 或 x/));
          done();
        });
    });
    // 用户名被占用的情况
    it('duplicate name', function(done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.jpg'))
        .field({ name: 'aaa', gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
        .redirects()
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.text);
          done();
        });
    });
    // 注册成功的情况
    it('success', function(done) {
      agent
        .post('/signup')
        .type('form')
        .attach('avatar', path.join(__dirname, 'avatar.jpg'))
        .field({ name: 'nswbmw', gender: 'm', bio: 'noder', password: '123456', repassword: '123456' })
        .redirects()
        .end(function(err, res) {
          if (err) return done(err);
          assert(res.text.match(/注册/));
          done();
        });
    });
  })




})
var express = require('express')
var app = express()
var path = require('path')
var session = require('express-session')
var MongonStore = require('connect-mongo')(session)
var flash = require('connect-flash')
var config = require('config-lite')(__dirname)
var routes = require('./routes')
// package.json
var pkg = require('./package')
// 添加日志
var winston = require('winston');
var expressWinston = require('express-winston');


/*
  莫版引擎
  设置视图模板的默认后缀名为.html,避免了每次res.Render("xx.html")的尴尬
 */
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

console.log(config, '----config')
/*
  设置静态文件
 */
app.use(express.static(path.join(__dirname, 'public')))

/*
  设置session中间件
 */
app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  cookie: {
    maxAge: config.session.maxAge
  },
  store: new MongonStore({
    url: config.mongodb
  })
}))

/*
  flash 中间件
 */
app.use(flash())
/*
  设置模版常量
 */
app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

/*
  处理表单及文件上传的中间件
 */
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),
  keepExtensions: true
}))


/*
  添加模版必须三个变量
 */
app.use(function(req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));

/*
  路由
 */
routes(app)

// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));

/*
  监听端口并启动
 */
// 如果 index.js 被 require 了，则导出 app，通常用于测试
if (module.parent) {
  module.exports = app;
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`);
  });
}
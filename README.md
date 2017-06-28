# 安装模块依赖
```
npm i config-lite connect-flash connect-mongo ejs express express-formidable express-session marked moment mongolass objectid-to-timestamp sha1 winston express-winston --save
```
# 对应模块的用处：
1. express: web 框架
2. express-session: session 中间件
3. connect-mongo: 将 session 存储于 mongodb，结合 express-session 使用
4. connect-flash: 页面通知提示的中间件，基于 session 实现
5. ejs: 模板
6. express-formidable: 接收表单及文件的上传中间件
7. config-lite: 读取配置文件
8. marked: markdown 解析
9. moment: 时间格式化
10. mongolass: mongodb 驱动
11. objectid-to-timestamp: 根据 ObjectId 生成时间戳
12. sha1: sha1 加密，用于密码加密
13. winston: 日志
14. express-winston: 基于 winston 的用于 express 的日志中间件

# 功能设计
1.功能及路由设计如下：
 - 注册
 - 注册页：GET /signup
 - 注册（包含上传头像）：POST /signup
2.登录
 - 登录页：GET /signin
 - 登录：POST /signin
 - 登出：GET /signout
3.查看文章
 - 主页：GET /posts
 - 个人主页：GET /posts?author=xxx
 - 查看一篇文章（包含留言）：GET /posts/:postId
4.发表文章
 - 发表文章页：GET /posts/create
 - 发表文章：POST /posts
5.修改文章
 - 修改文章页：GET /posts/:postId/edit
 - 修改文章：POST /posts/:postId/edit
 - 删除文章：GET /posts/:postId/remove
6.留言
 - 创建留言：POST /posts/:postId/comment
 - 删除留言：GET /posts/:postId/comment/:commentId/remove
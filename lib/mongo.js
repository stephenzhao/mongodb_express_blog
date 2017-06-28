var config = require('config-lite')
var Mongolass = require('mongolass')
var mongolass = new Mongolass()
var moment = require('moment')
var objectIdToTimestamp = require('objectid-to-timestamp');


mongolass.connect(config.mongodb)

//  addCreatedAt 自定义插件（通过 _id 生成时间戳）
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  }
})


exports.User = mongolass.model('User', {
  name: { type: 'string' },
  password: { type: 'string' },
  avatar: { type: 'string' },
  gender: { type: 'string', enum: ['m', 'f', 'x'] },
  bio: { type: 'string' }
})

// 设置了 name 的唯一索引，保证用户名是不重复的
exports.User.index({name: 1}, {unique: true}).exec()

exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId },
  title: { type: 'string' },
  content: { type: 'string' },
  pv: { type: 'number' }
});
// 按创建时间降序查看用户的文章列表
exports.Post.index({ author: 1, _id: -1 }).exec();
/*
  留言
 */
exports.Comment = mongolass.model('Comment', {
  author: { type: Mongolass.Types.ObjectId },
  content: { type: 'string' },
  postId: { type: Mongolass.Types.ObjectId }
});
exports.Comment.index({ postId: 1, _id: 1 }).exec();// 通过文章 id 获取该文章下所有留言，按留言创建时间升序
exports.Comment.index({ author: 1, _id: 1 }).exec();// 通过用户 id 和留言 id 删除一个留言
var User = require('../lib/mongo').User

module.exports = {
  create: function (user) {
    return User.create(user).exec()
  },
  // 这里我们使用了 addCreatedAt 自定义插件（通过 _id 生成时间戳）
  getUserByName: function (name) {
    return User.findOne({name: name})
            .addCreatedAt()
            .exec()
  }
}
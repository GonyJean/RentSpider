/**
 * 房价信息
 */

var mongoose = require("../db"),
  Schema = mongoose.Schema;

var czInfo58Schema = new Schema({
  url: { type: String }, //用户账号
  title: { type: String }, //密码
  sum: { type: String }, //年龄
  villageName: { type: Object }, //最近登录时间
  area: { type: Object }, //最近登录时间
  isPerson: { type: String },
  postTime: { type: String },
  location: { type: Object },
  cm: { type: String }, // 面积
  huxing: { type: String } // 朝向
});

module.exports = mongoose.model("czInfo58", czInfo58Schema);

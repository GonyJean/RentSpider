/**
 * 房价信息
 */

var mongoose = require('../db'),
    Schema = mongoose.Schema;

var xcInfoSchema = new Schema({          
    ip : { type: String },             // IP地址
    port: {type: String},                   // 端口号
    alive: {type: String},            // 存活时间
    postTime : { type: Object},
});




module.exports = mongoose.model('xcInfo',xcInfoSchema);
/**
 * 房价信息
 */

var mongoose = require('../db'),
    Schema = mongoose.Schema;

var xcInfoSchema = new Schema({          
    ip : { type: String },             // IP地址
    port: {type: String},                   // 端口号
    alive: {type: String},            // 存活时间
    type:{type:String}, // http https
    postTime : { type: Object},
    eff:{type:String} // 有效性
});




module.exports = mongoose.model('xcInfo',xcInfoSchema);
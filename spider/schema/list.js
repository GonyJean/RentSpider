/**
 * 房价信息
 */

var mongoose = require('../db'),
    Schema = mongoose.Schema;

var Info58Schema = new Schema({          
    title : { type: String },                    //用户账号
    sum: {type: String},                        //密码
    unit: {type: String},                        //年龄
    baseInfo : { type: Object},                 //最近登录时间
    user : { type: Object},                 //最近登录时间
    villageName: {type: String}, 
    area: {type: String}, 
    address: {type: String}, 
    developers: {type: String}, 
    postTime: {type: String}, 
    url: {type: String}, 
    location:{type:Object},
    type:{type:String}
});




module.exports = mongoose.model('Info58',Info58Schema);
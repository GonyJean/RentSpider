var express = require("express");
var router = express.Router();
import { getIp } from "../controller";

//定义一个get请求 path为根目录

/* GET home page. */
// router.get('/', function(req, res, next) {
//     res.render('index', { title: 'Express' });
// });

/**
 * 获取所有包含区域为''的信息
 */
router.get("/getAll", function(req, res) {
  // 默认返回的json 对象
  var whereStr = { area: { $regex: /新市/i } };
  var data = [];
  Info58.find(whereStr, function(err, data) {
    res.send(JSON.stringify(data));
  });
});

/**
 * 从数据库中随机获取1个IP
 */
router.get("/getIP", function(req, res) {
  // 默认返回的json 对象
  var whereStr = "ip";
  var data = [];
  getIp(res);
});

export default router;

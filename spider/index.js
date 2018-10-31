var express = require("express");
var path = require("path");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
var dburl = "mongodb://127.0.0.1:27017/HousePrice";
// var Info58 = require("./schema/list");

var superagent = require("superagent"); //发起请求
var charset = require("superagent-charset"); //解决乱码问题:
import router from './src/router'
charset(superagent);
require('superagent-proxy')(superagent);

app.use(router)

app.listen(3000);
mongoose.connect(
  dburl
)
console.log("启动服务成功....");

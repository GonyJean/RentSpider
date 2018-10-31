"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var getIp = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var userAgent, obj1, result;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
            obj1 = {};
            _context.prev = 2;
            _context.next = 5;
            return superagent.get("http://127.0.0.1:3000/getIp");

          case 5:
            result = _context.sent;

            console.log('result.headers:' + result.headers);
            console.log('result.body:' + result.body);
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](2);

            console.error(_context.t0);

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[2, 10]]);
  }));

  return function getIp() {
    return _ref.apply(this, arguments);
  };
}();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 *
 * 房租信息抓取
 *
 */

var cheerio = require("cheerio"); //可以像jquer一样操作界面
var charset = require("superagent-charset"); //解决乱码问题:
var superagent = require("superagent"); //发起请求
var requestProxy = require("superagent-proxy"); //发起请求
var async = require("async"); //异步抓取
var moment = require("moment");
var czInfo58 = require("../../schema/cz");
var request = require("request");
var xml2js = require("xml2js");
var baiduAK = "MfZGTw9zGqS8PbmjVN66IrbDGmI9SVM8";
var pageNum = 1;
var targetNum = 100;
var baseUrl = "http://xj.58.com/"; //地区url 自行修改
var userAgents = require("../../until/userAgent"); //浏览器头
requestProxy(superagent);
charset(superagent);

// var eventproxy = require('eventproxy');  //流程控制
// var ep = eventproxy();

moment.locale("zh-cn");

function insert(url, title, sum, villageName, area, isPerson, postTime, location) {
  var info = new czInfo58({
    url: url,
    title: title,
    sum: sum,
    villageName: villageName,
    area: area,
    isPerson: isPerson,
    postTime: postTime,
    location: location
  });
  info.save(function (err, res) {
    if (err) {
      console.log("Error:" + err);
    } else {
      console.log("Res:" + res);
    }
  });
}

getIp();
function getInfo(Num) {
  var obj = getIp();
  var userAgent = userAgents[parseInt(Math.random() * userAgents.length)];

  var ip = "http://" + obj.ip + ":" + obj.port;

  superagent.get(baseUrl + "chuzu" + "/pn" + Num) //这里设置编码
  .set({ "User-Agent": userAgent }).proxy(ip).end(function (err, res) {
    if (err) {
      console.log("抓取第" + Num + "页信息的时候出错了");
      return next(err);
    }

    var $ = cheerio.load(res.text);
    var list = $(".listUl li");
    var title = $(".des h2 a");
    var sum = $(".price .sum b").text() + $(".price .sum");

    list.each(function (i, e) {
      // var homeInfo = {
      //   title: "",
      //   sum: "",
      //   unit:"",

      //   postTime:'',
      //   url: ""
      // };
      var url = $(this).find(".des h2 a").attr("href");
      var title = $(this).find(".des h2 a").text();
      var sum = $(this).find(".money .strongbox").text().replace(/[\r\n\s+]/g, "");

      var villageName = $(this).find(".add").find("a").eq(1).text(); //  小区名称
      var area = $(this).find(".add").find("a").eq(0).text().replace(/[\r\n\s+]/g, ""); // 路
      var isPerson = $(this).find(".geren").find("span").text() == "来自个人房源" ? 1 : 0; // 地址
      var postTime = moment().format("L");
      var location = { lng: "", lat: "" };
      superagent.get(encodeURI("http://api.map.baidu.com/geocoder/v2/?address=" + "乌鲁木齐市" + area + "&output=XML&ak=" + baiduAK + "&callback=showLocation")).end(function (err, res) {
        if (err) {
          console.log("抓取第" + Num + "页信息的时候出错了");
          return next(err);
        }
        // console.log(res.body);
        // console.log(res.text);

        var parser = new xml2js.Parser();
        parser.parseString(res.text, function (err, result) {
          location.lat = result.GeocoderSearchResponse.result[0].location[0].lat[0];
          location.lng = result.GeocoderSearchResponse.result[0].location[0].lng[0];
        });
        insert(url, title, sum, villageName, area, isPerson, postTime, location);
      });
    });
    pageNum++;
    if (pageNum <= targetNum) {
      console.log("第" + pageNum + "页抓取结束");
      setTimeout(getInfo, 5050, pageNum);
    } else {
      console.log(1111111111111111111);
      return;
    }
  });
}

getInfo(pageNum);
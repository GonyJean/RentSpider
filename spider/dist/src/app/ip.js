"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 *
 * 代理池信息抓取
 *
 */

var cheerio = require("cheerio"); //可以像jquer一样操作界面
var charset = require("superagent-charset"); //解决乱码问题:
var superagent = require("superagent"); //发起请求
var requestProxy = require("superagent-proxy");
var userAgents = require("../../until/userAgent");
var async = require("async"); //异步抓取
var moment = require("moment");
var xiciInfo = require("../../schema/xc.js");
var request = require("request");
var xml2js = require("xml2js");
var baiduAK = "MfZGTw9zGqS8PbmjVN66IrbDGmI9SVM8";
var pageNum = 1;
var targetNum = 800;
// var baseUrl = "http://www.xicidaili.com/"; //信息
var baseUrl = "http://spys.one"; //信息
var type = "nn"; // nt:国内透明  nn:国内高匿
var countryUrlList = [];
var spyNum = 0;
var curIndex = 0;
var tempArr = [];
var tempArr2 = [];
var curArr = [];
var flag = false;
requestProxy(superagent);
charset(superagent);
moment.locale("zh-cn");

function insert(ip, port, alive, type, postTime) {
  var info = new xiciInfo({
    ip: ip,
    port: port,
    alive: alive,
    type: type,
    postTime: postTime
  });
  info.save(function (err, res) {
    if (err) {
      console.log("Error:" + err);
    } else {
      // console.log("Res:" + res);
    }
  });
}

function getInfo(Num) {
  superagent.get(baseUrl + type + "/" + Num) //这里设置编码
  .set("User-Agent", "Baiduspider").end(function (err, res) {
    if (err) {
      console.log("抓取第" + Num + "页信息的时候出错了");
      return next(err);
    }

    var $ = cheerio.load(res.text);
    var list = $("#ip_list");
    var ipContent = $("#ip_list tbody tr");
    var ipList = $("#ip_list tbody tr  td:nth-child(2)");
    var portList = $("#ip_list tbody tr  td:nth-child(3)");

    var sum = $(".price .sum b").text() + $(".price .sum");

    ipContent.each(function (i, e) {
      // var homeInfo = {
      //   title: "",
      //   sum: "",
      //   unit:"",
      var ip = $(this).find("td:nth-child(2)").text();
      var port = $(this).find("td:nth-child(3)").text();
      var alive = $(this).find("td:nth-child(9)").text();
      var type = $(this).find("td:nth-child(6)").text();
      var postTime = moment().format("L");
      if (ip !== "" && port !== "" && alive !== "") {
        insert(ip, port, alive, type, postTime);
      }
    });
    pageNum++;
    if (pageNum <= targetNum) {
      console.log("第" + pageNum + "页抓取结束");
      setTimeout(getInfo, 20, pageNum);
    } else {
      console.log();
      return;
    }
  });
}

function getSpysInfo(Num) {
  var spyNum = 0;
  var userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
  superagent.post("http://spys.one/en/anonymous-proxy-list/") //这里设置编码
  .proxy("http://127.0.0.1:1080").set({
    "User-Agent": " Mozilla/5.0 (Windows NT 10.0; WOW64)/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36"
  }).set({
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
  }).set({ "Content-Type": "application/x-www-form-urlencoded" }).set({
    Cookie: "_ga=GA1.2.1941524289.1544581739;_gid=GA1.2.117946455.1544581739"
  }).set({ "Upgrade-Insecure-Requests": 1 }).send({ xpp: 5, xf1: 1, xf2: 0, xf4: 0, xf5: 0 }).end(function (err, res) {
    if (err) {
      console.log("抓取spys.one信息的时候出错了");
      return next(err);
    }

    var $ = cheerio.load(res.text);
    var script = $("script").eq(3)[0].children[0].data;
    var list = $("td[colspan=10]").first().find("tbody").find("tr");
    var arr = script.split(";");
    var obj = {};
    arr.map(function (l, i) {
      obj[l.substring(0, l.indexOf("="))] = l.substring(l.indexOf("=") + 1);

      if (l.substring(0, l.indexOf("=")).length >= 6) {
        obj[l.substring(0, l.indexOf("="))] = l.substr(l.indexOf("=") + 1, 1);
      }
    });
    list.each(function (i, e) {
      if (i > 2) {
        var ip = $(this).find("td:nth-child(1)").find(".spy14").text();
        if ($(this).find("td:nth-child(1)").find(".spy14").children()[0]) {
          var portBefore1 = $(this).find("td:nth-child(1)").find(".spy14").children()[0].children[0].data;
          var portBefore2 = portBefore1.substring(portBefore1.indexOf("+") + 1);
          var portBefore3 = portBefore2.substring(portBefore2.length - 1, -1);
          var portBefore4 = portBefore3.split("+");
          var port = "";
          portBefore4.map(function (l, i) {
            var portBefore5 = l.substring(1, 7);
            port += obj[portBefore5];
          });
        }
        var alive = "spys";
        var type = $(this).find("td:nth-child(2)").find(".spy1").text();
        var postTime = moment().format("L");
        if (ip !== "" && port !== "" && alive !== "") {
          spyNum++;
          insert(ip, port, alive, type, postTime);
        }
        if (i <= list.length - 1) {
          console.log("spys: ip抓取结束,抓取数量" + spyNum);
        }
      }
    });
    // pageNum++;
    // if (pageNum <= targetNum) {
    //   setTimeout(getInfo, 20, pageNum);
    // } else {
    //   console.log();
    //   return;
    // }
  });
}
function decode(code) {
  code = code.replace(/^eval/, "");
  return eval(code);
}
function getCountryProxy(params) {
  if (curIndex >= countryUrlList.length) {
    console.log("所有国家IP抓取结束");
    return;
  }
  // if (!flag) {
  //   countryUrlList.map((l, i) => {
  //     if (i < 10) {
  //       curArr.push(l);
  //       curIndex = i;
  //     }
  //   });
  //   flag = true;
  // } 
  // else {
  //   countryUrlList.map((l, i) => {
  //     if (i > curIndex && i <= curIndex + 10) {
  //       curArr.push(l);
  //     }
  //   });
  //   curIndex += 10;
  // }

  async.mapLimit(countryUrlList, 3, function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(url, callback) {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:

              // setTimeout(function () {
              superagent.post(baseUrl + url).proxy("http://127.0.0.1:1080").end(function (err, res) {
                if (err) {
                  console.log(err);
                }
                var $ = cheerio.load(res.text);
                var xx0 = $("[type='hidden']").val();

                superagent.post(baseUrl + url) //这里设置编码
                .proxy("http://127.0.0.1:1080")
                // .set("Host", "spys.one")
                // .set("Connection", "keep-alive")
                // .set("Pragma", "no-cache")
                // .set("Cache-Control", "no-cache")
                // .set("Origin", "http://spys.one")
                .set("Cookie", "_ga=GA1.2.1941524289.1544581739; _gid=GA1.2.117946455.1544581739; _gat=1")
                // .set("Accept-Language", "zh-CN,zh;q=0.9")
                // .set("Accept-Encoding", "gzip, deflate")
                .set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36").set("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8")
                // .set("Referer", "http://spys.one/free-proxy-list/CZ/")
                .set("Upgrade-Insecure-Requests", 1).set("Referer", baseUrl + url).set("Content-Type", "application/x-www-form-urlencoded")
                // .type('form')
                .send({
                  xx0: xx0,
                  xpp: 5,
                  xf1: 0,
                  xf2: 0,
                  xf4: 0,
                  xf5: 0
                }).end(function (err, res) {
                  if (err) {
                    console.log(err);
                  }
                  var $ = cheerio.load(res.text);
                  var script = $("script").eq(3)[0].children[0].data;
                  var script1 = decode(script);
                  var list = $("td[colspan=10]").first().find("tbody").find("tr");
                  var arr = script1.split(";");
                  var disarr = [];
                  var obj = {};
                  var objDist = {};
                  arr.map(function (l, i) {
                    if (l.length >= 18) {
                      obj[l.substring(l.indexOf("="), -1)] = l.substring(l.indexOf("=") + 1).substring("^", l.substring(l.indexOf("=") + 1).indexOf("^"));
                    }
                    if (l.length <= 15) {
                      objDist[l.substring(l.indexOf("="), -1)] = l.substring(l.indexOf("=") + 1);
                    }
                  });
                  list.each(function (i, e) {
                    if (i > 2) {
                      var ip = $(this).find("td:nth-child(1)").find(".spy14").text();
                      if ($(this).find("td:nth-child(1)").find(".spy14").children()[0]) {
                        var portBefore1 = $(this).find("td:nth-child(1)").find(".spy14").children()[0].children[0].data;
                        var portBefore2 = portBefore1.substring(portBefore1.indexOf("+") + 1);
                        var portBefore3 = portBefore2.substring(portBefore2.length - 1, -1);

                        var portBefore4 = portBefore3.split("+");
                        var port = "";
                        portBefore4.map(function (l, i) {
                          var portBefore5 = l.substring(l.indexOf("^"), -1).substring(1);
                          port += objDist[obj[portBefore5]];
                        });
                      }
                      var alive = "spys";
                      var type = $(this).find("td:nth-child(2)").find(".spy1").text();
                      var postTime = moment().format("L");
                      if (ip !== "" && port !== "" && alive !== "") {
                        spyNum++;
                        insert(ip, port, alive, type, postTime);
                        if (i <= list.length - 1) {
                          console.log('当前页面: ' + baseUrl + url + '\n' + "spys: ip " + ip + ":" + port + "抓取结束,抓取数量" + spyNum);
                        }
                      }
                    }
                  });
                  callback(null);
                });
              });
              // },3000)

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }(), function (err, res) {
    console.log(err, res);
    console.log("所有国家IP抓取结束");
    // setTimeout(() => {
    //           getCountryProxy();
    //         }, 5000);
  });
}
function getCountryList() {
  var userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
  superagent.get("http://spys.one/en/proxy-by-country/") //这里设置编码
  .proxy("http://127.0.0.1:1080").end(function (err, res) {
    if (err) {
      console.log("抓取spys.one信息的时候出错了");
      return next(err);
    }
    var $ = cheerio.load(res.text);
    var list = $("td[colspan=10]").first().find("tbody").first().find("tr").find("a");

    list.each(function (i, l) {
      if (i > 3) {
        var str = $(this).attr("href");
        countryUrlList.push(str);
      }
      if (i >= list.length - 1) {
        getCountryProxy();
      }
    });
  });
}

getCountryList();
// getSpysInfo(pageNum);
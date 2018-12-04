"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var insert = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(url, title, sum, villageName, road, area, payWay, isPerson, postTime, location, cm, huxing) {
    var info;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            info = new czInfo58({
              url: url,
              title: title,
              sum: sum,
              villageName: villageName,
              road: road,
              area: area,
              payWay: payWay,
              isPerson: isPerson,
              postTime: postTime,
              location: location,
              cm: cm,
              huxing: huxing
            });

            info.save(function (err, res) {
              if (err) {
                console.log("Error:" + err);
              } else {
                console.log("Res:" + res);
              }
            });

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function insert(_x, _x2, _x3, _x4, _x5, _x6, _x7, _x8, _x9, _x10, _x11, _x12) {
    return _ref.apply(this, arguments);
  };
}();

var getIp = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var obj1, result, ipAdress;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            obj1 = {};
            _context2.prev = 1;
            _context2.next = 4;
            return superagent.get("http://127.0.0.1:3000/getIP");

          case 4:
            result = _context2.sent;

            console.log("result.headers:" + JSON.parse(result.text));
            ipAdress = JSON.parse(result.text)[0].ip + ':' + JSON.parse(result.text)[0].port;

            console.log("正在获取IP: " + ipAdress);
            return _context2.abrupt("return", ipAdress);

          case 11:
            _context2.prev = 11;
            _context2.t0 = _context2["catch"](1);

            console.error(_context2.t0);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[1, 11]]);
  }));

  return function getIp() {
    return _ref2.apply(this, arguments);
  };
}();

var getInfo = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(Num) {
    var obj, userAgent, ip;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return getIp();

          case 2:
            obj = _context3.sent;
            userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
            ip = "http://" + obj;

            if (!obj) {
              _context3.next = 9;
              break;
            }

            console.log("代理获取成功:" + ip + ",\n现在开始爬取信息...");
            _context3.next = 12;
            break;

          case 9:
            console.log("代理获取失败:" + ip + "!!!!,正在重新获取IP...");
            getInfo(pageNum);
            return _context3.abrupt("return");

          case 12:

            superagent.get(baseUrl + "chuzu" + "/pn" + pageNum) //这里设置编码
            .set({ "User-Agent": userAgent }).set({
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
            }).proxy(ip).timeout({ response: 3000, deadline: 60000 }).end(function (err, res) {
              if (err) {
                console.log("抓取第" + pageNum + "页信息的时候出错了,错误信息:" + err);
                getInfo(pageNum);
                console.log("正在重新获取IP...");
                return;
              }
              var $ = cheerio.load(res.text);
              var html = $("</div>").html(res.text)[0];
              if ($("html head script").last()[0] && $("html head script").last()[0].children[0]) {
                var bBase64 = $("html head script").last()[0].children[0].data; // base64处理前

                var aBase64 = (0, _reg.baseReg)(bBase64); // base64处理后
                aBase64 = new Buffer(aBase64, "base64");
                var list = $(".listUl li");
                var title = $(".des h2 a");
                var sum = $(".price .sum b").text() + $(".price .sum");
                var trFontlist = [];
                /**
                 * 保存字体文件
                 */
                fs.writeFile("font.woff", aBase64, function (err) {
                  if (err) throw err;
                  console.log("字体文件保存成功 !"); //文件被保存
                  exec("python transformFont.py", function (error, stdout, stderr) {
                    if (error) {
                      console.error("error: " + error);
                      return;
                    }
                    fs.readFile("6329.xml", "utf-8", function (e, r) {
                      parser.parseString(r, function (err, result) {
                        var fontList = result.ttFont.glyf[0].TTGlyph;
                        var dictList = result.ttFont.cmap[0].cmap_format_12;
                        fontList.map(function (l, i) {
                          var curName = null; // 当前匹配到的字体名称
                          var curIndex = 0;
                          // 0
                          if (l.$.xMax == "1113") {
                            curName = l.$.name;
                            curIndex = 0;
                          }
                          // 1
                          if (l.$.xMax == "1077") {
                            curName = l.$.name;
                            curIndex = 1;
                          }
                          // 2
                          if (l.$.xMax == "1062") {
                            curName = l.$.name;
                            curIndex = 2;
                          }
                          // 3
                          if (l.$.xMax == "1049") {
                            curName = l.$.name;
                            curIndex = 3;
                          }
                          // 4
                          if (l.$.xMax == "1128") {
                            curName = l.$.name;
                            curIndex = 4;
                          }
                          // 5
                          if (l.$.xMax == "1057") {
                            curName = l.$.name;
                            curIndex = 5;
                          }
                          // 6
                          if (l.$.xMax == "1115") {
                            curName = l.$.name;
                            curIndex = 6;
                          }
                          // 7
                          if (l.$.xMax == "1101") {
                            curName = l.$.name;
                            curIndex = 7;
                          }
                          // 8
                          if (l.$.xMax == "1098") {
                            curName = l.$.name;
                            curIndex = 8;
                          }
                          // 9
                          if (l.$.xMax == "1094") {
                            curName = l.$.name;
                            curIndex = 9;
                          }

                          dictList.map(function (m, mIndex) {
                            m.map.map(function (n, nIndex) {
                              if (n.$.name == curName && n.$.name != "glyph00000") trFontlist[curIndex] = n.$.code;
                            });
                          });
                          trFontlist.map(function (l, i) {
                            trFontlist[i] = trFontlist[i].replace("0x", "u");
                          });
                        });

                        console.log(trFontlist);

                        /**
                         * 遍历DOM 进行存储
                         */
                        list.each(function (i, e) {
                          // var homeInfo = {
                          //   title: "",
                          //   sum: "",
                          //   unit:"",

                          //   postTime:'',
                          //   url: ""
                          // };
                          var url = $(this).find(".des h2 a").attr("href");
                          var title = $(this).find(".des h2 a").text().replace(/[\r\n&#x\s+]/g, "");

                          var sum = $(this).find(".money .strongbox").text().replace(/[\r\n&#x\s+]/g, "");
                          var cmArr = $(this).find(".des .room").text().split("    ");
                          // .replace(/[\r\n\s+]/g, "");
                          var huxing = cmArr[0].replace(/[\r\n\s+]/g, ""); // 户型
                          var cm = cmArr[1]; // 面积
                          var villageName = $(this).find(".add").find("a").eq(1).text(); //  小区名称
                          var road = $(this).find(".add").find("a").eq(0).text().replace(/[\r\n\s+]/g, ""); // 路
                          var area; // 地区
                          var payWay; // 支付方式
                          var isPerson = $(this).find(".geren").find("span").text() == "来自个人房源" ? 1 : 0; // 地址
                          var postTime = moment().format("L");
                          var location = { lng: "", lat: "" };
                          if (url) {
                            superagent.get("https:" + url).set({ "User-Agent": userAgent }).set({
                              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
                            }).proxy(ip).timeout({ response: 5000, deadline: 60000 }).end(function (err, res) {
                              if (err) {
                                console.log("抓取第" + pageNum + "页[详情]信息的时候出错了,错误信息:" + err);
                                getInfo(pageNum);
                                console.log("正在重新获取IP...");
                                return;
                              }
                              var $ = cheerio.load(res.text);
                              area = $("ul.f14").eq(0).find("li").eq(-2).find("span").eq(1).find("a").eq(0).text();
                              payWay = $(".house-pay-way.f16").find("span").eq(1).text();

                              superagent.get(encodeURI("http://api.map.baidu.com/geocoder/v2/?address=" + "乌鲁木齐市" + area + "&output=XML&ak=" + baiduAK + "&callback=showLocation")).end(function (err, res) {
                                if (err) {
                                  console.log("抓取第" + pageNum + "页信息的时候出错了");
                                  return;
                                }
                                var parser = new xml2js.Parser();
                                parser.parseString(res.text, function (err, result) {
                                  location.lat = result.GeocoderSearchResponse.result[0].location[0].lat[0];
                                  location.lng = result.GeocoderSearchResponse.result[0].location[0].lng[0];
                                });

                                if (isPerson && url) {
                                  var realSum = "";
                                  var realTitle = "";
                                  var realCm = "";
                                  var realHuxing = "";
                                  var str = (0, _common.uniencode)(sum);
                                  var strTitle = (0, _common.uniencode)(title);
                                  var strCm = (0, _common.uniencode)(cm);
                                  var strHuxing = (0, _common.uniencode)(huxing);
                                  var strArr = str.split("%");
                                  var titleArr = strTitle.split("%");
                                  var cmArr = strCm.split("%");
                                  var huxingArr = strHuxing.split("%");
                                  strArr.map(function (l, i) {
                                    strArr[i] = strArr[i].toLowerCase();
                                    strArr[i] = strArr[i];
                                  });
                                  strArr.map(function (l, i) {
                                    if (l != "") {
                                      realSum += trFontlist.indexOf(l);
                                    }
                                  });
                                  titleArr.map(function (l, i) {
                                    var curL = trFontlist.indexOf(l.toLowerCase()) == -1 ? false : true;
                                    // 是字体文件
                                    if (curL) {
                                      realTitle += trFontlist.indexOf(titleArr[i].toLowerCase());
                                    }
                                    // 不是字体文件
                                    else if (l != "" && trFontlist.indexOf(titleArr[i].toLowerCase()) == -1) {
                                        realTitle += (0, _common.decodeUnicode)("\\" + l);
                                      }
                                  });
                                  cmArr.map(function (l, i) {
                                    var curL = trFontlist.indexOf(l.toLowerCase()) == -1 ? false : true;
                                    // 是字体文件
                                    if (curL) {
                                      realCm += trFontlist.indexOf(cmArr[i].toLowerCase());
                                    }
                                    // 不是字体文件
                                    else if (l != "" && trFontlist.indexOf(cmArr[i].toLowerCase()) == -1) {
                                        realCm += (0, _common.decodeUnicode)("\\" + l);
                                      }
                                  });
                                  huxingArr.map(function (l, i) {
                                    var curL = trFontlist.indexOf(l.toLowerCase()) == -1 ? false : true;
                                    // 是字体文件
                                    if (curL) {
                                      realHuxing += trFontlist.indexOf(huxingArr[i].toLowerCase());
                                    }
                                    // 不是字体文件
                                    else if (l != "" && trFontlist.indexOf(huxingArr[i].toLowerCase()) == -1) {
                                        realHuxing += (0, _common.decodeUnicode)("\\" + l);
                                      }
                                  });

                                  insert(url, realTitle, realSum, villageName, road, area, payWay, isPerson, postTime, location, realCm, realHuxing);
                                  console.log("房价字体已经过转换:" + sum + "==>" + realSum + "\n" + "标题字体已转换:" + title + "==>" + realTitle + "\n" + "户型字体已转换:" + huxing + "==>" + realHuxing + "\n");
                                } else if (!isPerson && url) {
                                  insert(url, title, sum, villageName, road, area, payWay, isPerson, postTime, location, cm, huxing);
                                }
                                console.log("第" + pageNum + "页抓取结束");

                                if (pageNum <= targetNum) {
                                  pageNum++;
                                  setTimeout(getInfo, 5500);
                                  return;
                                } else {
                                  console.log("获取结束");
                                  return;
                                }
                              });
                            });
                          }
                        });
                      });
                    });
                  });
                });
              } else {
                console.log("被检测到了 重新开始....");
                console.log("被检测到了 重新开始....");
                console.log("被检测到了 重新开始....");
                console.log("被检测到了 重新开始....");
                getInfo(Num);
                return;
              }
            });

          case 13:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function getInfo(_x13) {
    return _ref3.apply(this, arguments);
  };
}();

var _fontTransform = require("../../until/fontTransform");

var _reg = require("../../until/reg");

var _common = require("../../until/common");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 *
 * 房租信息抓取
 *
 */
var cheerio = require("cheerio");
var charset = require("superagent-charset"); //解决乱码问题:
var superagent = require("superagent"); //发起请求
var requestProxy = require("superagent-proxy"); //发起请求
var async = require("async"); //异步抓取
var moment = require("moment");
var czInfo58 = require("../../schema/cz");
var request = require("request");
var xml2js = require("xml2js");
var fs = require("fs");
var baiduAK = "MfZGTw9zGqS8PbmjVN66IrbDGmI9SVM8"; // 这里自行申请百度API 做地图经纬度转换用的
var pageNum = 1;
var targetNum = 100;
var baseUrl = "http://xj.58.com/"; //地区url 自行修改
var userAgents = require("../../until/userAgent"); //浏览器头
var exec = require("child_process").exec;
// import fonttools from 'fonttools';

requestProxy(superagent);
charset(superagent);
var dataBuffer = new Buffer(_fontTransform.base64Font, "base64");
var font_dict = [];
// var eventproxy = require('eventproxy');  //流程控制
// var ep = eventproxy();
moment.locale("zh-cn");

var parser = new xml2js.Parser();

getInfo(pageNum);
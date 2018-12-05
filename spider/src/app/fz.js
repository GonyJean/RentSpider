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
import { base64Font, XMLDate } from "../../until/fontTransform";
import { baseReg } from "../../until/reg";
import { str2utf8, uniencode, decodeUnicode } from "../../until/common";
requestProxy(superagent);
charset(superagent);
var dataBuffer = new Buffer(base64Font, "base64");
var font_dict = [];
// var eventproxy = require('eventproxy');  //流程控制
// var ep = eventproxy();
moment.locale("zh-cn");

var parser = new xml2js.Parser();

async function insert(
  url,
  title,
  sum,
  villageName,
  road,
  area,
  payWay,
  isPerson,
  postTime,
  location,
  cm,
  huxing
) {
  var info = new czInfo58({
    url,
    title,
    sum,
    villageName,
    road,
    area,
    payWay,
    isPerson,
    postTime,
    location,
    cm,
    huxing
  });
  info.save(function(err, res) {
    if (err) {
      console.log("Error:" + err);
    } else {
      console.log("Res:" + res);
    }
  });
}

async function getIp() {
  var obj1 = {};
  try {
    // const result = await superagent.get(
    //   "http://www.66ip.cn/nmtq.php?getnum=1&isp=0&anonymoustype=3&start=&ports=&export=&ipaddress=&area=0&proxytype=1&api=66ip"
    //   //
    // );
    // const obj = {};
    // console.log("result.headers:" + result.headers);

    // var pattIp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/;
    // var $ = cheerio.load(result.text);
    // var html = $("</div>").html(result.text)[0];
    // var ipAdress = html.childNodes[0].childNodes[1].childNodes[0].data;
    // // obj.ip = arr[0].ip;
    // // obj.port = arr[0].port;
    // obj1 = ipAdress;


     const result = await superagent.get(
      "http://127.0.0.1:3000/getSuccessIp"
    );
     console.log("result.headers:" + JSON.parse(result.text));
     var ipAdress = JSON.parse(result.text)[0].ip+':'+JSON.parse(result.text)[0].port ;
    console.log("正在获取IP: " + ipAdress);
    return ipAdress;
  } catch (error) {
    console.error(error);
  }

  // superagent.get().end(function(err, res) {
  //    if (err) {
  //       console.log("抓取第" + Num + "页信息的时候出错了");
  //       return next(err);
  //     }
  //   console.log(res);
  //   var obj = {};
  //   var arr = eval(res.text);
  //   obj.ip = arr[0].ip;
  //   obj.port = arr[0].port;
  //   obj1 = obj;
  //   return obj1
  // });
}
async function getInfo(Num) {
  var obj = await getIp();
  let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
  var ip ="https://" + obj;
  
  if (obj) {
    console.log("代理获取成功:" + ip + ",\n现在开始爬取信息...");
  } else {
    console.log("代理获取失败:" + ip + "!!!!,正在重新获取IP...");
    getInfo(pageNum);
    return;
  }

  superagent
    .get(baseUrl + "chuzu" + "/pn" + pageNum) //这里设置编码
    .set({ "User-Agent": userAgent })
    .set({
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
    })
    .proxy(ip)
    .timeout({ response: 3000, deadline: 60000 })
    .end(function(err, res) {
      if (err) {
        console.log("抓取第" + pageNum + "页信息的时候出错了,错误信息:" + err);
        getInfo(pageNum);
        console.log("正在重新获取IP...");
        return;
      }
      var $ = cheerio.load(res.text);
      var html = $("</div>").html(res.text)[0];
      if ($("html head script").last()[0]&&$("html head script").last()[0].children[0]) {
        var bBase64 = $("html head script").last()[0].children[0].data; // base64处理前

        var aBase64 = baseReg(bBase64); // base64处理后
        aBase64 = new Buffer(aBase64, "base64");
        var list = $(".listUl li");
        var title = $(".des h2 a");
        var sum = $(".price .sum b").text() + $(".price .sum");
        var trFontlist = [];
        /**
         * 保存字体文件
         */
        fs.writeFile("font.woff", aBase64, function(err) {
          if (err) throw err;
          console.log("字体文件保存成功 !"); //文件被保存
          exec("python transformFont.py", function(error, stdout, stderr) {
            if (error) {
              console.error("error: " + error);
              return;
            }
            fs.readFile("6329.xml", "utf-8", function(e, r) {
              parser.parseString(r, function(err, result) {
                var fontList = result.ttFont.glyf[0].TTGlyph;
                var dictList = result.ttFont.cmap[0].cmap_format_12;
                fontList.map((l, i) => {
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

                  dictList.map((m, mIndex) => {
                    m.map.map((n, nIndex) => {
                      if (n.$.name == curName && n.$.name != "glyph00000")
                        trFontlist[curIndex] = n.$.code;
                    });
                  });
                  trFontlist.map((l, i) => {
                    trFontlist[i] = trFontlist[i].replace("0x", "u");
                  });
                });

                console.log(trFontlist);

                /**
                 * 遍历DOM 进行存储
                 */
                list.each(function(i, e) {
                  // var homeInfo = {
                  //   title: "",
                  //   sum: "",
                  //   unit:"",

                  //   postTime:'',
                  //   url: ""
                  // };
                  var url = $(this)
                    .find(".des h2 a")
                    .attr("href");
                  var title = $(this)
                    .find(".des h2 a")
                    .text()
                    .replace(/[\r\n&#x\s+]/g, "");

                  var sum = $(this)
                    .find(".money .strongbox")
                    .text()
                    .replace(/[\r\n&#x\s+]/g, "");
                  var cmArr = $(this)
                    .find(".des .room")
                    .text()
                    .split("    ");
                  // .replace(/[\r\n\s+]/g, "");
                  var huxing = cmArr[0].replace(/[\r\n\s+]/g, ""); // 户型
                  var cm = cmArr[1]; // 面积
                  var villageName = $(this)
                    .find(".add")
                    .find("a")
                    .eq(1)
                    .text(); //  小区名称
                  var road = $(this)
                    .find(".add")
                    .find("a")
                    .eq(0)
                    .text()
                    .replace(/[\r\n\s+]/g, ""); // 路
                  var area; // 地区
                  var payWay; // 支付方式
                  var isPerson =
                    $(this)
                      .find(".geren")
                      .find("span")
                      .text() == "来自个人房源"
                      ? 1
                      : 0; // 地址
                  var postTime = moment().format("L");
                  var location = { lng: "", lat: "" };
                  if (url) {
                    superagent
                      .get("https:" + url)
                      .set({ "User-Agent": userAgent })
                      .set({
                        Accept:
                          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
                      })
                      .proxy(ip)
                      .timeout({ response: 5000, deadline: 60000 })
                      .end((err, res) => {
                        if (err) {
                          console.log(
                            "抓取第" +
                              pageNum +
                              "页[详情]信息的时候出错了,错误信息:" +
                              err
                          );
                          getInfo(pageNum);
                          console.log("正在重新获取IP...");
                          return;
                        }
                        var $ = cheerio.load(res.text);
                        area = $("ul.f14")
                          .eq(0)
                          .find("li")
                          .eq(-2)
                          .find("span")
                          .eq(1)
                          .find("a")
                          .eq(0)
                          .text();
                        payWay = $(".house-pay-way.f16")
                          .find("span")
                          .eq(1)
                          .text();

                        superagent
                          .get(
                            encodeURI(
                              "http://api.map.baidu.com/geocoder/v2/?address=" +
                                "乌鲁木齐市" +
                                area +
                                "&output=XML&ak=" +
                                baiduAK +
                                "&callback=showLocation"
                            )
                          )
                          .end(function(err, res) {
                            if (err) {
                              console.log(
                                "抓取第" + pageNum + "页信息的时候出错了"
                              );
                              return ;
                            }
                            var parser = new xml2js.Parser();
                            parser.parseString(res.text, function(err, result) {
                              location.lat =
                                result.GeocoderSearchResponse.result[0].location[0].lat[0];
                              location.lng =
                                result.GeocoderSearchResponse.result[0].location[0].lng[0];
                            });

                            if (isPerson && url) {
                              var realSum = "";
                              var realTitle = "";
                              var realCm = "";
                              var realHuxing = "";
                              var str = uniencode(sum);
                              var strTitle = uniencode(title);
                              var strCm = uniencode(cm);
                              var strHuxing = uniencode(huxing);
                              var strArr = str.split("%");
                              var titleArr = strTitle.split("%");
                              var cmArr = strCm.split("%");
                              var huxingArr = strHuxing.split("%");
                              strArr.map((l, i) => {
                                strArr[i] = strArr[i].toLowerCase();
                                strArr[i] = strArr[i];
                              });
                              strArr.map((l, i) => {
                                if (l != "") {
                                  realSum += trFontlist.indexOf(l);
                                }
                              });
                              titleArr.map((l, i) => {
                                var curL =
                                  trFontlist.indexOf(l.toLowerCase()) == -1
                                    ? false
                                    : true;
                                // 是字体文件
                                if (curL) {
                                  realTitle += trFontlist.indexOf(
                                    titleArr[i].toLowerCase()
                                  );
                                }
                                // 不是字体文件
                                else if (
                                  l != "" &&
                                  trFontlist.indexOf(
                                    titleArr[i].toLowerCase()
                                  ) == -1
                                ) {
                                  realTitle += decodeUnicode("\\" + l);
                                }
                              });
                              cmArr.map((l, i) => {
                                var curL =
                                  trFontlist.indexOf(l.toLowerCase()) == -1
                                    ? false
                                    : true;
                                // 是字体文件
                                if (curL) {
                                  realCm += trFontlist.indexOf(
                                    cmArr[i].toLowerCase()
                                  );
                                }
                                // 不是字体文件
                                else if (
                                  l != "" &&
                                  trFontlist.indexOf(cmArr[i].toLowerCase()) ==
                                    -1
                                ) {
                                  realCm += decodeUnicode("\\" + l);
                                }
                              });
                              huxingArr.map((l, i) => {
                                var curL =
                                  trFontlist.indexOf(l.toLowerCase()) == -1
                                    ? false
                                    : true;
                                // 是字体文件
                                if (curL) {
                                  realHuxing += trFontlist.indexOf(
                                    huxingArr[i].toLowerCase()
                                  );
                                }
                                // 不是字体文件
                                else if (
                                  l != "" &&
                                  trFontlist.indexOf(
                                    huxingArr[i].toLowerCase()
                                  ) == -1
                                ) {
                                  realHuxing += decodeUnicode("\\" + l);
                                }
                              });

                              insert(
                                url,
                                realTitle,
                                realSum,
                                villageName,
                                road,
                                area,
                                payWay,
                                isPerson,
                                postTime,
                                location,
                                realCm,
                                realHuxing
                              );
                              console.log(
                                "房价字体已经过转换:" +
                                  sum +
                                  "==>" +
                                  realSum +
                                  "\n" +
                                  "标题字体已转换:" +
                                  title +
                                  "==>" +
                                  realTitle +
                                  "\n" +
                                  "户型字体已转换:" +
                                  huxing +
                                  "==>" +
                                  realHuxing +
                                  "\n"
                              );
                            
                            } else if (!isPerson && url) {
                              insert(
                                url,
                                title,
                                sum,
                                villageName,
                                road,
                                area,
                                payWay,
                                isPerson,
                                postTime,
                                location,
                                cm,
                                huxing
                              );
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
}

getInfo(pageNum);

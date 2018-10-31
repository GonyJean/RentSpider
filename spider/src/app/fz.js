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
var fs = require("fs");
var baiduAK = "MfZGTw9zGqS8PbmjVN66IrbDGmI9SVM8";
var pageNum = 1;
var targetNum = 100;
var baseUrl = "http://xj.58.com/"; //地区url 自行修改
var userAgents = require("../../until/userAgent"); //浏览器头
import fonttools from 'fonttools';
import { readFileSync } from 'fs';
const { decompile, compile } = fonttools();
requestProxy(superagent);
charset(superagent);

// var eventproxy = require('eventproxy');  //流程控制
// var ep = eventproxy();

moment.locale("zh-cn");

//  fs.writeFile("font.woff",base64Font,function (err) {
//      if (err) throw err ;
//      console.log("File Saved !"); //文件被保存
//  }) ;

const fontBuffer = readFileSync('font.ttf');
const fontXMLBuffer = decompile(fontBuffer);
const fontBinaryBuffer = compile(fontXMLBuffer);
function insert(
  url,
  title,
  sum,
  villageName,
  area,
  isPerson,
  postTime,
  location
) {
  var info = new czInfo58({
    url,
    title,
    sum,
    villageName,
    area,
    isPerson,
    postTime,
    location
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
    const result = await superagent.get("http://127.0.0.1:3000/getIp");
    const obj = {};
    console.log('result.headers:'+result.headers);
    var arr = eval( result.res.text)
    obj.ip = arr[0].ip;
    obj.port = arr[0].port;
    obj1 = obj;
    console.log("正在获取IP...");
    return obj1
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
  // var obj = await getIp()
  let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];

  // var ip = "http://" + obj.ip + ":" + obj.port;
  // if (obj.ip) console.log('代理获取成功:'+ip+',\n现在开始爬取信息...');
  
  superagent
    .get(baseUrl + "chuzu" + "/pn" + Num) //这里设置编码
    .set({ "User-Agent": userAgent })
    // .proxy(ip)
    .end(function(err, res) {
      if (err) {
        console.log("抓取第" + Num + "页信息的时候出错了,错误信息:"+ err);
        getInfo(Num)
        console.log("正在重新获取IP...");

        return 
      }

      var $ = cheerio.load(res.text);
      var list = $(".listUl li");
      var title = $(".des h2 a");
      var sum = $(".price .sum b").text() + $(".price .sum");

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
          .text();
        var sum = $(this)
          .find(".money .strongbox")
          .text()
          .replace(/[\r\n\s+]/g, "");

        var villageName = $(this)
          .find(".add")
          .find("a")
          .eq(1)
          .text(); //  小区名称
        var area = $(this)
          .find(".add")
          .find("a")
          .eq(0)
          .text()
          .replace(/[\r\n\s+]/g, ""); // 路
        var isPerson =
          $(this)
            .find(".geren")
            .find("span")
            .text() == "来自个人房源"
            ? 1
            : 0; // 地址
        var postTime = moment().format("L");
        var location = { lng: "", lat: "" };
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
              console.log("抓取第" + Num + "页信息的时候出错了");
              return next(err);
            }
            // console.log(res.body);
            // console.log(res.text);

            var parser = new xml2js.Parser();
            parser.parseString(res.text, function(err, result) {
              location.lat =
                result.GeocoderSearchResponse.result[0].location[0].lat[0];
              location.lng =
                result.GeocoderSearchResponse.result[0].location[0].lng[0];
            });
            insert(
              url,
              title,
              sum,
              villageName,
              area,
              isPerson,
              postTime,
              location
            );
          });
      });
      pageNum++;
      if (pageNum <= targetNum) {
        console.log("第" + pageNum + "页抓取结束");
        setTimeout(getInfo, 50, pageNum);
      } else {
        console.log('获取结束');
        return;
      }
    });
}
getInfo(pageNum);

/**
 * 
 * 二手房价信息抓取
 * 
 */


var cheerio = require("cheerio"); //可以像jquer一样操作界面
var charset = require("superagent-charset"); //解决乱码问题:
var superagent = require("superagent"); //发起请求
charset(superagent);
var async = require("async"); //异步抓取
var moment = require('moment')
var Info58 = require("../../schema/list");
var request = require("request");
var xml2js = require('xml2js');
// var eventproxy = require('eventproxy');  //流程控制
// var ep = eventproxy();
var baiduAK = "MfZGTw9zGqS8PbmjVN66IrbDGmI9SVM8";
var pageNum = 1;
var targetNum = 100;
var baseUrl = "http://xj.58.com/"; //信息
moment.locale('zh-cn')
function insert(
  title,
  sum,
  unit,
  baseInfo,
  user,
  villageName,
  area,
  address,
  developers,
  postTime,
  url,
  location
) {
  var info = new Info58({
    title,
    sum,
    unit,
    baseInfo,
    user,
    villageName,
    area,
    address,
    developers,
    postTime,
    url,
    location
  });

  info.save(function(err, res) {
    if (err) {
      console.log("Error:" + err);
    } else {
      // console.log("Res:" + res);
    }
  });
}

function getInfo(Num) {
  superagent
    .get(baseUrl + "ershoufang" + "/pn" + Num) //这里设置编码
    .set("User-Agent", "Baiduspider")
    .end(function(err, res) {
      if (err) {
        console.log("抓取第" + Num + "页信息的时候出错了");
        return next(err);
      }

      var $ = cheerio.load(res.text);
      var list = $(".house-list-wrap li");
      var title = $(".house-list-wrap .title a");
      var sum = $(".price .sum b").text() + $(".price .sum");

      list.each(function(i, e) {
        // var homeInfo = {
        //   title: "",
        //   sum: "",
        //   unit:"",
        var baseInfo = { pattern: "", acreage: "", orientations: "", type: "" };
        //   villageName: "",
        //   area: "",
        //   address: "",
        //   developers: "",
        var user = { name: "", img: "", date: "", type: "" };
        //   postTime:'',
        //   url: ""
        // };
        var url = $(this)
          .find(".title a")
          .attr("href");
        var title = $(this)
          .find(".title a")
          .text();
        var sum = $(this)
          .find(".price .sum")
          .text()
          .replace(/[\r\n\s+]/g, "");
        var unit = $(this)
          .find(".price .unit")
          .text()
          .replace(/[\r\n\s+]/g, "");
        baseInfo.pattern = $(this)
          .find(".baseinfo")
          .eq(0)
          .find("span")
          .first()
          .text()
          .replace(/[\r\n\s+]/g, ""); // 格局
        baseInfo.acreage = $(this)
          .find(".baseinfo")
          .eq(0)
          .find("span")
          .eq(1)
          .text(); // 面积
        baseInfo.orientations = $(this)
          .find(".baseinfo")
          .eq(0)
          .find("span")
          .eq(2)
          .text(); // 朝向
        baseInfo.type = $(this)
          .find(".baseinfo")
          .eq(0)
          .find("span")
          .eq(3)
          .text(); // 类型(多层/高层)
        var villageName = $(this)
          .find(".baseinfo")
          .eq(1)
          .find("span a")
          .eq(0)
          .text(); //  小区名称
        var area = $(this)
          .find(".baseinfo")
          .eq(1)
          .find("span a")
          .eq(1)
          .text()
          .replace(/[\r\n\s+]/g, ""); // 片区
          
        var address = $(this)
          .find(".baseinfo")
          .eq(1)
          .find("span a")
          .eq(2)
          .text()
          .replace(/[\r\n\s+]/g, ""); // 地址
        var developers = $(this)
          .find(".jjrinfo")
          .text()
          .replace(/[\r\n\s+]/g, ""); // 开发商
        user.name = $(this)
          .find(".jjrinfo a")
          .text()
          .replace(/[\r\n\s+]/g, "");
        user.date = $(this)
          .find(".jjrinfo .wlt")
          .text()
          .replace(/[\r\n\s+]/g, "");
        user.img = $(this)
          .find(".jjrinfo .jjrtip img")
          .attr("src");
        var postTime = moment().format('LL')
        var location = { lng: "", lat: "" };
        var type = '二手房'
        superagent
          .get(
            encodeURI(
              "http://api.map.baidu.com/geocoder/v2/?address=" +
                "乌鲁木齐市" +
                area +
                address +
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
            // parser.parseString(res.text, function(err, result) {
            //   location.lat=result.GeocoderSearchResponse.result[0].location[0].lat[0];
            //   location.lng=result.GeocoderSearchResponse.result[0].location[0].lng[0];
            // });
            insert(
              title,
              sum,
              unit,
              baseInfo,
              user,
              villageName,
              area,
              address,
              developers,
              postTime,
              url,
              location,
              type
            );
          });
      });
      pageNum++;
      if (pageNum <= targetNum && list.length >=1) {
        console.log("第" + pageNum + "页抓取结束");
        setTimeout(getInfo, 5050, pageNum);
      }
      else if(list.length ==0){
        console.log("抓取列表长度为空!!!!");
      }
       else {
        console.log("抓取结束了");
        return;
      }
    });
}
getInfo(pageNum);


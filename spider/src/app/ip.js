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
var baseUrl = "http://www.xicidaili.com/"; //信息
var type = "nn"; // nt:国内透明  nn:国内高匿

requestProxy(superagent);
charset(superagent);
moment.locale("zh-cn");

function insert(ip, port, alive, type, postTime) {
  var info = new xiciInfo({
    ip,
    port,
    alive,
    type,
    postTime
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
    .get(baseUrl + type + "/" + Num) //这里设置编码
    .set("User-Agent", "Baiduspider")
    .end(function(err, res) {
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

      ipContent.each(function(i, e) {
        // var homeInfo = {
        //   title: "",
        //   sum: "",
        //   unit:"",
        var ip = $(this)
          .find("td:nth-child(2)")
          .text();
        var port = $(this)
          .find("td:nth-child(3)")
          .text();
        var alive = $(this)
          .find("td:nth-child(9)")
          .text();
        var type = $(this)
          .find("td:nth-child(6)")
          .text();
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
  let spyNum = 0
  let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
  superagent
    .post("http://spys.one/en/anonymous-proxy-list/") //这里设置编码
    .proxy("http://127.0.0.1:1080")
    .set({ "User-Agent": ' Mozilla/5.0 (Windows NT 10.0; WOW64)/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36' })
    .set({ "Accept": 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'})
    .set({ "Content-Type": 'application/x-www-form-urlencoded'})
    .set({ "Cookie": '_ga=GA1.2.1941524289.1544581739;_gid=GA1.2.117946455.1544581739'})
    .set({ "Upgrade-Insecure-Requests": 1})
    .send({ xpp: 5, xf1: 1, xf2: 0, xf4: 0, xf5: 0 })
    .end(function(err, res) {
      if (err) {
        console.log("抓取spys.one信息的时候出错了");
        return next(err);
      }

      var $ = cheerio.load(res.text);
      var script = $("script").eq(3)[0].children[0].data;
      var list = $("td[colspan=10]")
        .first()
        .find("tbody")
        .find("tr")
      var arr = script.split(";");
      var obj = {};
      arr.map((l, i) => {
        obj[l.substring(0, l.indexOf("="))] = l.substring(l.indexOf("=") + 1);

        if (l.substring(0, l.indexOf("=")).length >= 6) {
          obj[l.substring(0, l.indexOf("="))] = l.substr(l.indexOf("=") + 1, 1);
        }
      });
      list.each(function(i, e) {
        if (i > 2) {
          
          var ip = $(this)
        .find("td:nth-child(1)")
            .find(".spy14")
            .text();
        if($(this).find("td:nth-child(1)").find(".spy14").children()[0]){
          var portBefore1 = $(this).find("td:nth-child(1)").find(".spy14").children()[0].children[0].data
          var portBefore2=portBefore1.substring(portBefore1.indexOf('+')+1)
          var portBefore3=portBefore2.substring(portBefore2.length-1,-1)
          var portBefore4=portBefore3.split("+")
          var port = ''
          portBefore4.map((l,i)=>{
            var portBefore5 = l.substring(1,7)
            port += obj[portBefore5]
          }) 
          }
          var alive = 'spys'
          var type = $(this)
          .find("td:nth-child(2)")
            .find(".spy1")
            .text();
          var postTime = moment().format("L");
          if (ip !== "" && port !== "" && alive !== "") {
            spyNum++;
            insert(ip, port, alive, type, postTime);
          }
          if (i<=list.length-1) {
            console.log("spys: ip抓取结束,抓取数量"+spyNum);
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
getSpysInfo(pageNum);

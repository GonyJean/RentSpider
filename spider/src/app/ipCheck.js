/**
 *
 * 代理池信息抓取
 *
 */

var cheerio = require("cheerio"); //可以像jquer一样操作界面
var charset = require("superagent-charset"); //解决乱码问题:
var superagent = require("superagent"); //发起请求
var requestProxy = require("superagent-proxy"); //发起请求

var async = require("async"); //异步抓取
var moment = require("moment");
var xiciInfo = require("../../schema/xc.js");
var request = require("request");
var xml2js = require("xml2js");
var userAgents = require("../../until/userAgent"); //浏览器头
import {Common} from "../until/common" ; 
// var eventproxy = require('eventproxy');  //流程控制
// var ep = eventproxy();
var baiduAK = "MfZGTw9zGqS8PbmjVN66IrbDGmI9SVM8";
var pageNum = 1;
var curNum = 0;
var curErrNum = 0;
var successNum = 0;
var targetNum = 2000;
var baseUrl = "http://www.xicidaili.com/"; //信息
var type = "nn"; // nt:国内透明  nn:国内高匿
requestProxy(superagent);
charset(superagent);
moment.locale("zh-cn");
async function checkIp() {
  var obj1 = {};
  try {
    const result = await superagent.get("http://127.0.0.1:3000/getIP");
    console.log("result.headers:" + JSON.parse(result.text));
    //  var ipAdress = JSON.parse(result.text)[0].ip+':'+JSON.parse(result.text)[0].port ;
    var ipAdress = JSON.parse(result.text);
    // console.log("正在获取IP列表: " + ipAdress);
    return ipAdress;
  } catch (error) {
    console.error(error);
  }
}
function insert(obj, type) {
  if (!type) {
    xiciInfo.deleteMany({ 'ip':obj,'eff':type }).exec(function(err, data) {
      
    if (err) {
      console.log(err);
    }
    console.log('删除了标识为0的记录:' + obj);
    
  });
    xiciInfo.deleteMany({ 'ip':obj,'eff':{ $exists: false } }).exec(function(err, data) {
      
    if (err) {
      console.log(err);
    }
    console.log(data);
    
  });
    console.log('删除了不存在exists标识的记录:' + obj);
    
  }else{
      xiciInfo.update({ 'ip': obj }, {$set:{'eff': type}}).exec(function(err, data) {
    if (err) {
      console.log(err);
    }
    console.log('将ip:' + obj + '的eff更新为了'+type);
  });
  }


}

async function getInfo() {
  var objArr = await checkIp();
  async.mapLimit(
    objArr,
    15,
    function(obj, callback) {
      let userAgent = userAgents[parseInt(Math.random() * userAgents.length)];
      var ip = "http://" + obj.ip + ":" + obj.port;
      // var ip = "http://127.0.0.1:1080";
      
      superagent
        .get("https://xj.58.com") //这里设置编码
        .set({ "User-Agent": userAgent })
        .proxy(ip)
        .timeout({ response: 4000 })
        .end(function(err, res) {
          var curip = obj.ip;
          if (err) {
            curNum++;
            curErrNum++;
            console.log(
              "ip:  " + ip + "无效,继续抓取!",
              "\n错误信息:" +
                err +
                "\n当前有效IP:" +
                successNum +
                "个" +
                "\n当前无效IP:" +
                curErrNum +
                "个" +
                "\n当前总共检查IP:" +
                curNum +
                "个\n"+
                "ip存活率:"+Common.toPercent(successNum/curNum)+
                "\n=================================================="
            );

            insert(curip, 0);
            callback(null);
            return;
          }

          curNum++;
          successNum++;
          console.log("====================================");
          console.log(
            "检测到有效IP,地址是: " +
              ip +
              "\n当前有效IP数量: " +
              successNum +
              "\n当前总共检查IP:" +
              curNum +
              "个\n"+
              "ip存活率:"+Common.toPercent(successNum/curNum)
          );
          console.log("====================================");
          insert(curip, 3);
          callback(null, true);
        });
    },
    (error, results) => {
      if (successNum >= targetNum) {
        console.log("有效目标:" + targetNum + "到了! 结束检查");
        return;
      }
      console.log("抓取目标:" + successNum + "个,开始下一轮!");
      getInfo();
    }
  );
}

getInfo();

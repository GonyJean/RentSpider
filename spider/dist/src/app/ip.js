"use strict";

/**
 *
 * 代理池信息抓取
 *
 */

var cheerio = require("cheerio"); //可以像jquer一样操作界面
var charset = require("superagent-charset"); //解决乱码问题:
var superagent = require("superagent"); //发起请求
charset(superagent);
var async = require("async"); //异步抓取
var moment = require("moment");
var xiciInfo = require("../../schema/xc.js");
var request = require("request");
var xml2js = require("xml2js");
// var eventproxy = require('eventproxy');  //流程控制
// var ep = eventproxy();
var baiduAK = "MfZGTw9zGqS8PbmjVN66IrbDGmI9SVM8";
var pageNum = 1;
var targetNum = 100;
var baseUrl = "http://www.xicidaili.com/"; //信息
var type = 'nn'; // nt:国内透明  nn:国内高匿
moment.locale("zh-cn");

function insert(ip, port, alive, postTime) {
  var info = new xiciInfo({
    ip: ip,
    port: port,
    alive: alive,
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
  superagent.get(baseUrl + type + '/' + Num) //这里设置编码
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
      var ip = $(this).find('td:nth-child(2)').text();
      var port = $(this).find('td:nth-child(3)').text();
      var alive = $(this).find('td:nth-child(9)').text();
      var postTime = moment().format("L");
      if (ip !== '' && port !== '' && alive !== '') {}
      insert(ip, port, alive, postTime);
    });
    pageNum++;
    if (pageNum <= targetNum) {
      console.log("第" + pageNum + "页抓取结束");
      setTimeout(getInfo, 500, pageNum);
    } else {

      console.log();
      return;
    }
  });
}
getInfo(pageNum);
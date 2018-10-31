"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIp = getIp;
var XC = require("../../schema/xc");

/**
 * 随机获取一条记录
 *
 * @getIp
 */
function getIp(res) {
  XC.aggregate([{ $sample: { size: 1 } }]).exec(function (err, data) {
    res.send(JSON.stringify(data));
  });
}
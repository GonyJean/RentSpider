'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Common = exports.Common = {
  toPercent: function toPercent(str) {
    return (Math.round(str * 10000) / 100).toFixed(2) + '%';
  }
};
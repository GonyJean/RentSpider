"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.uniencode = uniencode;
exports.decodeUnicode = decodeUnicode;
var str2utf8 = exports.str2utf8 = function str2utf8(str) {
    return eval("'" + encodeURI(str).replace(/%/gm, "\\x") + "'");
};

function uniencode(text) {
    text = escape(text.toString()).replace(/\+/g, "%2B");
    var matches = text.match(/(%([0-9A-F]{2}))/gi);
    if (matches) {
        for (var matchid = 0; matchid < matches.length; matchid++) {
            var code = matches[matchid].substring(1, 3);
            if (parseInt(code, 16) >= 128) {
                text = text.replace(matches[matchid], '%u00' + code);
            }
        }
    }
    text = text.replace('%25', '%u0025');

    return text;
}

function decodeUnicode(str) {
    str = str.replace(/\\/g, "%");
    return unescape(str);
}
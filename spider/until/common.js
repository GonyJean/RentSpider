export var str2utf8 = function(str) {
  return eval("'" + encodeURI(str).replace(/%/gm, "\\x") + "'");
};



export function uniencode(text)
{
    text = escape(text.toString()).replace(/\+/g, "%2B");
    var matches = text.match(/(%([0-9A-F]{2}))/gi);
    if (matches)
    {
        for (var matchid = 0; matchid < matches.length; matchid++)
        {
            var code = matches[matchid].substring(1,3);
            if (parseInt(code, 16) >= 128)
            {
                text = text.replace(matches[matchid], '%u00' + code);
            }
        }
    }
    text = text.replace('%25', '%u0025');
 
    return text;
} 

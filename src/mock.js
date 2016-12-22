/**
 * @file json mock middelware
 * @author hushicai(bluthcy@gmail.com)
 */

// inspired from gulp-mock-server

var url = require('url');
var util = require('util');
var fs = require('fs');
var path = require('path');
var rd = require('rd');
var CWD = process.cwd();
var checkMark = /\.json|\.js/;

module.exports = function(mockDir) {
  return function(req, res, next){
    var urlObj = url.parse(req.url, true);
    var dir = path.resolve(CWD, mockDir);
    var fullName = path.join(dir, urlObj.pathname);
    var fileNames = rd.readSync(dir)
      .filter(function(x) {return checkMark.test(x);})
      .map(function(x) {
        return {
          name: x.replace(checkMark, ''),
          verb: x.match(checkMark)[0]
        };
      });

    var hasFile = false;
    var verb = 'json'; // 文件后缀

    // 查找本地是否存在这个文件
    fileNames.forEach(function(item) {
        if (fullName === item.name) {
            hasFile = true;
            verb = item.verb;
        }
    });

    // 本地存在文件
    if (hasFile) {
        var inlineData; // 写在check条件里的数据
        var delay = 0;
        var filePath = path.join(fullName + verb);

        console.log('[gulp-mock-server]', req.url + '=>' + filePath);

        delete require.cache[require.resolve(filePath)];
        res.setHeader("Access-Control-Allow-Origin", "*");
        if (urlObj.query&&urlObj.query.callback) {
            res.setHeader('Content-type', 'application/javascript;charset=utf-8');
            setTimeout(function() {
                res.end(
                  urlObj.query.callback + '(' + JSON.stringify(inlineData || require(filePath)) + ')'
                );
            }, delay);
        } else {
            res.setHeader('Content-Type', 'application/json;charset=utf-8');
            setTimeout(function() {
                res.end(JSON.stringify(inlineData || require(filePath)));
            }, delay);
        }
        return;
    }

    next();
  }
}

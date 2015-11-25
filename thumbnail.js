/**
 * Created by jsharp on 2015-11-20.
 *
 *      Varafy Inc.
 *
 */

var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var childProcess = require('child_process');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;

var template = ejs.compile(fs.readFileSync(__dirname + '/thumbpage.ejs', 'utf-8'));

var renderThumbnail = function(html, cb) {
  var content = template({
    html: html,
    fontSize: 14,
    width: 500,
    labelFontSize: 14,
  });

  var childArgs = [path.join(__dirname, 'render.js'), content];
  console.log('executing render.js');
  childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
    // handle results
    if (err) throw err;
    cb(stdout);
  });
};

module.exports = renderThumbnail;

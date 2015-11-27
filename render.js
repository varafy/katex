/**
 * Created by jsharp on 2015-11-20.
 *
 *      Varafy Inc.
 *
 */

var fs = require('fs');
var system = require('system');
var webpage = require('webpage');
// var html = system.args[1];
var html = fs.read('test.html');
var page = webpage.create();

var IMAGE_NAME = 'rendered/test.png';
var IMAGE_HTML_NAME = 'rendered/test.html';

page.paperSize = {
  format: 'Letter',
  orientation: 'portrait'
  /*margin: {
    left: '.39in',
    right: '.38in',
    top: '.39in',
    bottom: '0in'
  }*/
};

console.log('calling render on html of length:', html.length);
//console.log(page.content);
/*page.render('google.pdf', {format: 'pdf'}, function(err) {
  if (err) {
    console.log(err);
    phantom.exit();
  }

  console.log('check out the google.pdf');
  phantom.exit();
});*/

function renderThumbnail(err) {
  console.log('Calling renderThumbnail');
  if (err) {
    console.log(err);
  } else {
    page.render(IMAGE_NAME, {format: 'png'});
    fs.write(IMAGE_HTML_NAME, page.content, 'w');
  }

  phantom.exit(0);
}

page.onLoadStarted = function () {
  console.log('Loading starts.');
};

//page.onLoadFinished = function(status) {
//  console.log('finished with status:', status);
//  console.log(page.content)
//};
function multipleIncludeJs(jsArray, done) {
  if (jsArray.length === 0) {
    done();
    return;
  }

  var url = jsArray.shift();
  page.includeJs(url, function(){
    console.log('Loaded Url:', url);
    multipleIncludeJs(jsArray, done);
  });
}

page.content = html;
var MathJaxJS = 'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_SVG-full';
var JQueryJS = 'http://code.jquery.com/jquery-2.1.4.min.js';

multipleIncludeJs([JQueryJS, MathJaxJS], function() {
  if (!page.injectJs('test-html.js')) {
    console.log('Could not injectJs.');
    phantom.exit(0);
    return;
  }

  var interval;
  var allDone;
  allDone = page.evaluate(function () {
    if (window.MathJax) {
      // MathJax.Hub.Register.StartupHook('End', function () {
      //   window.allDone = 1;
      // });

      return false;
    } else {
      return true;
    }
  });

  if (allDone) {
    console.log('window.MathJax does not exist.');
    console.log('Content.length:', page.content && page.content.length);
    renderThumbnail();
  } else {
    var time = performance.now();
    console.log('window.MathJax does exists.');
    console.log('Started Rendering...');
    interval = setInterval(function () {
      var statusArr = page.evaluate(function() {
        return window.renderStatus;
      });

      var allDone = page.evaluate(function () {
        return window.allDone;
      });

      console.log(allDone ? '::finished' : '::rendering', '-', (performance.now() - time).toFixed(2), 'ms');

      if (statusArr) {
        var statusCount = countBy(statusArr);
        var strCon = '{ ';
        for (var stKey in statusCount) {
          if (!statusCount.hasOwnProperty(stKey)) return;
          strCon += stKey + ': ' + statusCount[stKey] + ', ';
        }
        console.log(strCon + '}');
      }

      if (allDone) {
        clearInterval(interval);
        renderThumbnail();
      }
    }, 100);
  }
});

function countBy(arr, pred) {
  var hash = {};
  pred = pred || function(val) { return val; };
  for (var i = 0, n = arr.length; i < n; i++) {
    var val = arr[i];
    var key = pred(val, i, arr);
    hash[key] = (hash[key] + 1) || 1;
  }

  return hash;
}
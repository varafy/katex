/**
 * Created by jsharp on 2015-11-20.
 *
 *      Varafy Inc.
 *
 */
var USE_CHILD_PROCESSES = false;
var USE_NODE_PHANTOM = true;
var RENDERED_IMAGE_DIR = 'rendered/thumbnail.png';

var path = require('path');
var ejs = require('ejs');
var fs = require('fs');
var childProcess = require('child_process');
var phantom = require('phantom');
var binPath = 'phantomjs';
var runImm = process.argv[2] === '--run';
console.log('Arguments:')
process.argv.forEach(function(val, key) {
  console.log('  ' + key + ': ' + val);
});

var template = ejs.compile(fs.readFileSync(__dirname + '/thumbpage.ejs', 'utf-8'));

var renderThumbnail = function(html, cb) {
  console.log('HTML.length:', html.length);
  var content = html;
  // var content = template({
  //   html: html
  // });

  console.log('CONTENT_LENGTH:', content.length);

  if (USE_CHILD_PROCESSES) {
    console.log('Initiating Child_Process method.');
    var childArgs = [path.join(__dirname, 'render.js'), content];
    console.log(binPath, path.join(__dirname, 'render.js'), 'length: ' + content.length);

    var child = childProcess.spawn(binPath, childArgs);

    child.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    child.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    child.on('close', function (code) {
      console.log('child process exited with code ' + code);
    });
  }

  if (USE_NODE_PHANTOM) {
    console.log('Initiating PhantomJS-Node');
    phantom.create(function(ph) {
      console.log('Phantom Created. Creating Page.');
      ph.createPage(function(page) {
        console.log('Setting page.settings.');
        page.settings = {
          loadImages: true,
          localToRemoteUrlAccessEnabled: true,
          javascriptEnabled: true,
          loadPlugins: false
        };

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

        function renderThumbnail() {
          page.renderBase64('PNG', function(base64) {
            if (!base64) console.log('WAHGHHH no base64:', base64);
            fs.writeFileSync('rendered/thumbnail_64.txt', base64);
            console.log("::PDF GENERATED");
            ph.exit();
            cb && cb();
          });
        }

        console.log('Settings other data.');
        page.set('viewportSize', { width: 800, height: 600 });
        page.set('paperSize', { format: 'A4', orientation: 'portrait', border: '1cm' });
        page.set('content', html, function(content) {
          var MathJaxJS = 'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_SVG-full';
          var JQueryJS = 'http://code.jquery.com/jquery-2.1.4.min.js';

          multipleIncludeJs([JQueryJS, MathJaxJS], function() {
            page.injectJs('test-html.js');

            var interval;
            var allDone;
            allDone = page.evaluate(function () {
              if (window.MathJax) {
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
              var time = process.hrtime()[0];
              console.log('window.MathJax does exists.');
              console.log('Started Rendering...');

              // Make sure the injectJs() call worked.
              page.evaluate(function() {
                return window.recievedTestHtmlJs
              }, function(result) {
                console.log('recievedTestHtmlJs:', result);
              });

              // Make sure the injectJs() call worked and that the jQuery call worked.
              page.evaluate(function() {
                return window.recievedTestHtmlJs$
              }, function(result) {
                console.log('recievedTestHtmlJs$:', result);
              });

              // Detect when the page is done loading.
              interval = setInterval(function () {
                // Check the rendering status.
                page.evaluate(function() {
                  return window.renderStatus;
                }, function(statusArr) {
                  if (statusArr) {
                    var statusCount = countBy(statusArr);
                    var strCon = '{ ';
                    for (var stKey in statusCount) {
                      if (!statusCount.hasOwnProperty(stKey)) return;
                      strCon += stKey + ': ' + statusCount[stKey] + ', ';
                    }
                    console.log(strCon + '}');
                  }
                });

                // Check the allDone status.
                page.evaluate(function () {
                  return window.allDone;
                }, function(allDone) {
                  console.log(allDone ? '::finished' : '::rendering', '-', (process.hrtime()[0] - time).toFixed(2), 'ms');

                  if (allDone) {
                    clearInterval(interval);
                    renderThumbnail();
                  }
                });
              }, 100);
            }
          });
        });
      });
    });
  }
};

// Immediately so that it can be called from the console.
if (runImm) {
  console.log('Running immediately.');
  renderThumbnail(fs.readFileSync('test.html').toString(), function() {
    console.log('Proccess finished.');
  });
}

module.exports = renderThumbnail;

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
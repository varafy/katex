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
//var phantom = require('phantom');
// var phantom = require('node-phantom');
//var phantomjs = require('phantomjs');
var binPath = 'phantomjs';
var runImm = process.argv[2] === '--run';
console.log('Arguments:')
process.argv.forEach(function(val, key) {
  console.log('  ' + key + ': ' + val);
});

var template = ejs.compile(fs.readFileSync(__dirname + '/thumbpage.ejs', 'utf-8'));

var renderThumbnail = function(html, cb) {
  console.log('HTML.length:', html.length);
  var content = '';
  // var content = template({
  //   html: html
  // });

  console.log('CONTENT_LENGTH:', content.length);

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

  // childProcess.exec(binPath, childArgs, function(err, stdout, stderr) {
  //   console.log('return:', arguments);

  //   // handle results
  //   if (err) throw err;
  //   cb(stdout);
  // });

  /*phantom.create(function(ph) {
    function render(err) {
      if (err) {
        console.log(err);
      } else {
        page.render('google.png', {format: 'png'});
        cb('Success!');
      }

      ph.exit();
    }

    ph.createPage(function(page) {
      page.set('viewPortSize', {
        width: 500,
        height: 1000
      });

      page.set('onLoadFinished', function() {
        console.log('loadFinishedContent:', page.content);
      });

      page.setContent(content, function() {
        console.log('setContent!');

        //page.evaluate(function(s) {
        //  console.log('Document:', document);
        //});
        //console.log(page.content);
        //console.log(page.get);
        //page.set('onLoadFinished', function (success) {
          //console.log(success);
          ////if (!success) {
          //  render(new Error('Error rendering page, no success onLoadFinished'));
          //  return;
          //}
          //console.log('onloadFinished!');
          //console.log('PHANTOM_CONTENT_LENGTH:', page.get('content').length);
          var interval;
          var allDone;
          //console.log(content);

          allDone = page.evaluate(function() {
            console.log('MathJax:', window.MathJax);
            if (window.MathJax) {
              MathJax.Hub.Register.StartupHook('End', function () {
                window.allDone = 1;
              });

              return false;
            } else {
              return true;
            }
          });

          if (allDone) {
            render();
            return;
          }

          var count = 0;

          interval = setInterval(function () {
            var allDone = page.evaluate(function () {
              return window.allDone;
            });

            console.log(allDone);

            if (allDone) {
              clearInterval(interval);
              render();
            }

            if (count++ > 20) {
              clearInterval(interval);
              render(new Error('Could not get window.allDone to pass'));
            }
          }, 100);
        }, function() {
          console.log('finished the render!');
        });



      //});
    });
  });*/

  // phantom.create(function(error, ph) {
  //   ph.createPage(function(error, page) {
  //     page.settings = {
  //       loadImages: true,
  //       localToRemoteUrlAccessEnabled: true,
  //       javascriptEnabled: true,
  //       loadPlugins: false
  //     };

  //     page.set('viewportSize', { width: 800, height: 600 });
  //     page.set('paperSize', { format: 'A4', orientation: 'portrait', border: '1cm' });
  //     page.set('content', html, function(error) {
  //       if (error) {
  //         console.log('Error setting content: ', error);
  //       }
  //     });

  //     page.onResourceRequested = function(rd, req) {
  //       console.log("REQUESTING: ", rd[0]["url"]);
  //     };

  //     page.onResourceReceived = function(rd) {
  //       rd.stage == "end" && console.log("LOADED: ", rd["url"]);
  //     };

  //     page.onLoadFinished = function(status) {
  //       page.render('google.png', function(error) {
  //         if (error) console.log('Error rendering PNG: %s', error);
  //         console.log("PDF GENERATED : ", status);
  //         ph.exit();
  //         cb && cb();
  //       });
  //     };
  //   });
  // });
};

if (runImm) {
  console.log('Running immediately.');
  renderThumbnail(fs.readFileSync('test.html').toString(), function() {
    console.log('Proccess finished.');
  });
}

module.exports = renderThumbnail;
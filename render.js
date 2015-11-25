/**
 * Created by jsharp on 2015-11-20.
 *
 *      Varafy Inc.
 *
 */

var fs = require('fs');
var system = require('system');
var webpage = require('webpage');
//var html = system.args[1];
var html = fs.read('test.html');
var page = webpage.create();

console.log('running render');
//console.log(html);
//console.log(system.args);
//console.log(system.args[0]);
//console.log(system.args[1]);

//console.log(html);
//page.content = html;
page.paperSize = {
  format: 'Letter',
  orientation: 'portrait',
  margin: {
    left: '.39in',
    right: '.38in',
    top: '.39in',
    bottom: '0in'
  }
};

console.log('calling render');
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
  if (err) {
    console.log(err);
  } else {
    console.log('Post Load:', page.content);
    page.render('google.png', {format: 'png'});
  }

  phantom.exit(0);
}

page.open('test.html', function(status) {
  //console.log('Pre Load Content: ' + page.content);
  var interval;
  var allDone;

  if (status !== 'success') {
    renderThumbnail(new Error('Error rendering page'));
    return;
  }

  allDone = page.evaluate(function () {
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
    renderThumbnail();
    return;
  }

  interval = setInterval(function () {
    var allDone = page.evaluate(function () {
      return window.allDone;
    });

    console.log(allDone);

    if (allDone) {
      clearInterval(interval);
      renderThumbnail();
    }
  }, 100);
});

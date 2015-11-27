/**
 * Created by jsharp on 2015-11-20.
 *
 *      Varafy Inc.
 *
 */

var fs = require('fs');
var system = require('system');
var webpage = require('webpage');
var html = system.args[1];
// var html = fs.read('test.html');
var page = webpage.create();

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
  console.log('calling renderThumbnail');
  if (err) {
    console.log(err);
  } else {
    //console.log('Post Load:', page.content);
    page.render('google.png', {format: 'png'});
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

page.open('test.html', function(success) {
  //console.log('Pre Load Content: ' + page.content);
  var interval;
  var allDone;

  if (!success) {
    renderThumbnail(new Error('Error rendering page'));
    return;
  }

  // set hook for when MathJax is done
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
//});
});

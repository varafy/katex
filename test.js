// var page = require('webpage').create();
//page.open('./test.html', function() {
//	page.render('test.pdf');
//	phantom.exit();
//});

var webpage = require('webpage');

var capture = function(page, pageUrl, callback) {
	page.open(pageUrl, function(status) {
		var interval, allDone;

		if (status !== 'success') {
			callback(new Error('Error rendering page'));
			return;
		}

		allDone = page.evaluate(function() {
			if (window.MathJax) {
				MathJax.Hub.Register.StartupHook('End', function() {
					window.allDone = 1;
				});

				return false;
			} else {
				return true;
			}
		});

		if (allDone) {
			callback();
			return;
		}

		interval = setInterval(function() {
			var allDone = page.evaluate(function() {
				return window.allDone;
			});

			if (allDone) {
				clearInterval(interval);
				callback();
			}
		}, 100);
	});
};

var page = webpage.create();

page.paperSize = {
	format: 'Letter',
	orientation: 'portrait',
	margin: {
		left: '.39in',
		right: '.38in',
		top: '.39in',
		bottom: '0in',
	},
};

var pageUrl = './test.html';

capture(page, pageUrl, function(err) {
	if (err) {
		console.log(err);
	} else {
		page.render('test.pdf', {format: 'pdf'});
	}

	phantom.exit(0);
});

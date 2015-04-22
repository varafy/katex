var page = require('webpage').create();
page.open('./test.html', function() {
	page.render('test.pdf');
	phantom.exit();
});

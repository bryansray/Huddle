var page = require('page'),
		Ractive = require('ractive');

var navigationHandler = function(handler, onNavigation) {
	return function(context) {
		handler(context, (error, PageComponent = {}, data = {}) => {
			context.pageName = PageComponent._name;
			context.state = data;
			onNavigation(context, error);
		});
	};
};

exports.init = function(routes, onNavigation) {
	routes.forEach((handler, path) => {
		page(path, navigationHandler(handler, onNavigation));
	});

	page({ hashbang: false });
};

exports.navigateTo = function(url) {
	page.show(url);
};
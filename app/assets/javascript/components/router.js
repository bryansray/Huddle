var Ractive = require('ractive');

var Router = Ractive.extend({
	template: '<RouteHandler />',

	components: {
		RouteHandler: function() {
			return this.get('componentName');
		}
	},

	oninit: function() {
		this.observe('componentName', function(newValue, oldValue) {
			if (this.fragment.rendered) this.reset();
		});
	}
});

module.exports = Router;
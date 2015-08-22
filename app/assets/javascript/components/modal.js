var Ractive = require('ractive');

var ModalComponent = Ractive.extend({
	el: document.body,
	append: true,
	template: '#modal-template',

	oninit: function() {
		// this.set("title", this.title);

		// this.on('*.close', this.log);
		// this.on('close', this.close);
	},

	center: function() {
		var outerHeight = this.container.clientHeight,
				modalHeight = this.modal.clientHeight,
				verticalSpace = ( outerHeight - modalHeight ) / 2;

		this.modal.style.top = verticalSpace + 'px';
	},

	close: function(event) {
		this.teardown();
		// if (!this.modal.contains( event.original.target )) this.teardown();
		// return false;
	}
});

module.exports = ModalComponent;
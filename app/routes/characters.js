var characters = require('../controllers/characters');

module.exports = function(app) {
	app.route('/characters').get(characters.index);
};
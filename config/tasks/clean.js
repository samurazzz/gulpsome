const del = require('del');
const PATHS = require('../helpers/paths');

const clean = () => {
	return del(PATHS.clean, { force: true });
};

module.exports = clean;

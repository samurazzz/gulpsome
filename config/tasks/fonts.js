const { src, dest } = require('gulp');
const PATHS = require('../helpers/paths');

const fonts = () => {
	return src(PATHS.dev.fonts).pipe(dest(PATHS.prod.fonts));
};

module.exports = fonts;

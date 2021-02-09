const { src, dest } = require('gulp');
const PATHS = require('../helpers/paths');

const imagesDev = () => {
	return src(PATHS.dev.img).pipe(dest(PATHS.prod.img));
};

module.exports = imagesDev;

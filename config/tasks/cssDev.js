const { src, dest } = require('gulp');
const sass = require('gulp-sass');
const groupMedia = require('gulp-group-css-media-queries');
const sourceMaps = require('gulp-sourcemaps');
const PATHS = require('../helpers/paths');

const stylesDev = () => {
	return src(PATHS.dev.css, { allowEmpty: true })
		.pipe(sass({ includePaths: './node_modules/' }))
		.pipe(groupMedia())
		.pipe(sourceMaps.init())
		.pipe(sourceMaps.write('.'))
		.pipe(dest(PATHS.prod.css));
};

module.exports = stylesDev;

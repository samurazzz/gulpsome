const { src, dest } = require('gulp');
const sass = require('gulp-sass');
const groupMedia = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const PATHS = require('../helpers/paths');

const stylesProd = () => {
	return src(PATHS.dev.css)
		.pipe(
			sass({
				outputStyle: 'expanded',
				includePaths: './node_modules/',
			})
		)
		.pipe(groupMedia())
		.pipe(
			autoprefixer({
				overrideBrowserslist: ['last 15 versions'],
				cascade: true,
			})
		)
		.pipe(cleanCSS())
		.pipe(dest(PATHS.prod.css));
};

module.exports = stylesProd;

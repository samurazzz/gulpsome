const { src, dest } = require('gulp');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify');
const PATHS = require('../helpers/paths');
const config = require('../helpers/webpack.config');

const scriptsProd = () => {
	return src(PATHS.dev.js, { allowEmpty: true })
		.pipe(
			webpackStream({
				mode: 'production',
				...config,
			})
		)
		.pipe(uglify())
		.pipe(dest(PATHS.prod.js));
};

module.exports = scriptsProd;

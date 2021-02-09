const { src, dest } = require('gulp');
const sourceMaps = require('gulp-sourcemaps');
const webpackStream = require('webpack-stream');
const PATHS = require('../helpers/paths');
const config = require('../helpers/webpack.config');
const through = require('through2');

function pushSouceMap(file, enc, cb) {
	const isSourceMap = /\.map$/.test(file.path);
	if (!isSourceMap) this.push(file);
	cb();
}

const scriptsDev = () => {
	return src(PATHS.dev.js, { allowEmpty: true })
		.pipe(webpackStream({ mode: 'development', devtool: 'source-map', ...config }))
		.pipe(sourceMaps.init({ loadMaps: true }))
		.pipe(through.obj(pushSouceMap))
		.pipe(sourceMaps.write('.'))
		.pipe(dest(PATHS.prod.js));
};

module.exports = scriptsDev;

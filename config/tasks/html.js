const { src, dest } = require('gulp');
const pug = require('gulp-pug');
const PATHS = require('../helpers/paths');

const html = () => {
	return src(PATHS.dev.html, { cwd: '../' })
		.pipe(pug({ pretty: true }))
		.pipe(dest(PATHS.prod.root));
};

module.exports = html;

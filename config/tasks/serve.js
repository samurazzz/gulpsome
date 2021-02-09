// = Imports =
const { watch } = require('gulp');
const browsersync = require('browser-sync').create();
const PATHS = require('../helpers/paths');

// = Tasks =
const html = require('./html');
const stylesDev = require('./cssDev');
const scriptsDev = require('./jsDev');
const imagesDev = require('./imagesDev');

const serve = () => {
	browsersync.init({
		server: { baseDir: PATHS.prod.root },
		port: 3000,
		tunnel: true,
		host: 'localhost',
		logPrefix: 'Frontend',
		notify: false,
	});

	watch([PATHS.watch.html]).on('change', () => {
		html();
		browsersync.reload();
	});
	watch([PATHS.watch.css]).on('change', () => {
		stylesDev();
		browsersync.reload();
	});
	watch([PATHS.watch.js]).on('change', () => {
		scriptsDev();
		browsersync.reload();
	});
	watch([PATHS.watch.img]).on('change', () => {
		imagesDev();
		browsersync.reload();
	});
};

module.exports = serve;

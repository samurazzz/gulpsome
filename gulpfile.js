// = Libs =
const { parallel, series, src, dest, watch } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const groupMedia = require('gulp-group-css-media-queries');
const sourceMaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const config = require('./webpack.config');
const webpackStream = require('webpack-stream');
const through = require('through2');
const imagemin = require('gulp-imagemin');
const browsersync = require('browser-sync').create();
const del = require('del');

// = Paths =
const DEV_FOLDER = 'src';
const PROD_FOLDER = 'dist';

const PATHS = {
	dev: {
		root: `${DEV_FOLDER}/`,
		html: [`${DEV_FOLDER}/**/*.pug`, `!${DEV_FOLDER}/components/**/*.pug`],
		css: `${DEV_FOLDER}/sass/main.scss`,
		js: `${DEV_FOLDER}/js/main.js`,
		img: `${DEV_FOLDER}/assets/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
		fonts: `${DEV_FOLDER}/assets/fonts/**/*.{eot,woff2,woff,ttf,svg}`,
	},
	prod: {
		root: `${PROD_FOLDER}/`,
		css: `${PROD_FOLDER}/css/`,
		js: `${PROD_FOLDER}/js/`,
		img: `${PROD_FOLDER}/assets/img/`,
		fonts: `${PROD_FOLDER}/assets/fonts/`,
	},
	watch: {
		root: `${DEV_FOLDER}/`,
		html: `${DEV_FOLDER}/**/*.pug`,
		css: `${DEV_FOLDER}/sass/**/*.scss`,
		js: `${DEV_FOLDER}/js/**/*.js`,
		img: `${DEV_FOLDER}/assets/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
	},
	clean: `${PROD_FOLDER}/`,
};

function pushSouceMap(file, enc, cb) {
	const isSourceMap = /\.map$/.test(file.path);
	if (!isSourceMap) this.push(file);
	cb();
}

const html = () => {
	return src(PATHS.dev.html)
		.pipe(pug({ pretty: true }))
		.pipe(dest(PATHS.prod.root))
		.pipe(browsersync.stream());
};

const stylesDev = () => {
	return src(PATHS.dev.css, { allowEmpty: true })
		.pipe(sass({ includePaths: './node_modules/' }))
		.pipe(groupMedia())
		.pipe(sourceMaps.init())
		.pipe(sourceMaps.write('.'))
		.pipe(dest(PATHS.prod.css))
		.pipe(browsersync.stream());
};

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

const scriptsDev = () => {
	return src(PATHS.dev.js, { allowEmpty: true })
		.pipe(webpackStream({ mode: 'development', devtool: 'source-map', ...config }))
		.pipe(sourceMaps.init({ loadMaps: true }))
		.pipe(through.obj(pushSouceMap))
		.pipe(sourceMaps.write('.'))
		.pipe(dest(PATHS.prod.js))
		.pipe(browsersync.stream());
};

const scriptsProd = () => {
	return src(PATHS.dev.js, { allowEmpty: true })
		.pipe(
			webpackStream({
				mode: 'production',
				...config,
			})
		)
		.pipe(dest(PATHS.prod.js));
};

const imagesDev = () => {
	return src(PATHS.dev.img).pipe(dest(PATHS.prod.img));
};

const imagesProd = () => {
	return src(PATHS.dev.img)
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 85, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(dest(PATHS.prod.img));
};

const fonts = () => {
	return src(PATHS.dev.fonts).pipe(dest(PATHS.prod.fonts));
};

const serve = () => {
	browsersync.init({
		server: { baseDir: PATHS.prod.root },
		port: 3000,
		host: 'localhost',
		logPrefix: 'Frontend',
		notify: false,
	});

	watch([PATHS.watch.html], html);
	watch([PATHS.watch.css], stylesDev);
	watch([PATHS.watch.js], scriptsDev);
	watch([PATHS.watch.img], imagesDev);
};

const clean = () => {
	return del(PATHS.clean, { force: true });
};

// = Exports =
exports.default = series(clean, parallel(serve, scriptsDev, stylesDev, html, imagesDev, fonts));
exports.build = series(clean, parallel(scriptsProd, stylesProd, html, imagesProd, fonts));

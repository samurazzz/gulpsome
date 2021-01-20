// = Plugins =
const { src, dest, parallel, series, watch } = require('gulp');
const pug = require('gulp-pug');
const browsersync = require('browser-sync').create();
const del = require('del');
const sourceMaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const groupMedia = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const rollup = require('gulp-better-rollup');
const { babel } = require('@rollup/plugin-babel');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');

// = Paths =
const devFolder = 'src';
const prodFolder = 'dist';
const PATHS = {
	dev: {
		root: `${devFolder}/`,
		html: [`${devFolder}/**/*.pug`, `!${devFolder}/components/**/*.pug`],
		css: `${devFolder}/sass/main.scss`,
		js: `${devFolder}/js/main.js`,
		img: `${devFolder}/assets/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
		fonts: `${devFolder}/assets/fonts/**/*.{eot,woff2,woff,ttf,svg}`,
	},
	prod: {
		root: `${prodFolder}/`,
		css: `${prodFolder}/css/`,
		js: `${prodFolder}/js/`,
		img: `${prodFolder}/assets/img/`,
		fonts: `${prodFolder}/assets/fonts/`,
	},
	watch: {
		root: `${devFolder}/`,
		html: `${devFolder}/**/*.pug`,
		css: `${devFolder}/sass/**/*.scss`,
		js: `${devFolder}/js/**/*.js`,
		img: `${devFolder}/assets/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp}`,
	},
	clean: `./${prodFolder}/`,
};

// = Browser-sync
const browserSync = () => {
	browsersync.init({
		server: { baseDir: PATHS.prod.root },
		port: 3000,
		notify: false,
	});
};

// = Watch =
const watchFiles = () => {
	watch([PATHS.watch.html], html);
	watch([PATHS.watch.css], stylesDev);
	watch([PATHS.watch.js], scriptsDev);
	watch([PATHS.watch.img], imagesDev);
};

// = Clean =
const clean = () => {
	return del(PATHS.clean);
};

// = HTML ==
const html = () => {
	return src(PATHS.dev.html)
		.pipe(pug({ pretty: true }))
		.pipe(dest(PATHS.prod.root))
		.pipe(browsersync.stream());
};

// = CSS (dev) =
const stylesDev = () => {
	return src(PATHS.dev.css, { allowEmpty: true })
		.pipe(sass({ includePaths: './node_modules/' }))
		.pipe(groupMedia())
		.pipe(sourceMaps.init())
		.pipe(sourceMaps.write('.'))
		.pipe(dest(PATHS.prod.css))
		.pipe(browsersync.stream());
};

// = CSS (prod) =
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

// = JavaScript (dev) =
const scriptsDev = () => {
	return src(PATHS.dev.js)
		.pipe(sourceMaps.init())
		.pipe(
			rollup(
				{
					treeshake: true,
					plugins: [nodeResolve(), commonjs()],
				},
				{ format: 'iife' }
			)
		)
		.pipe(sourceMaps.write('.'))
		.pipe(dest(PATHS.prod.js))
		.pipe(browsersync.stream());
};

// = JavaScript (prod) =
const scriptsProd = () => {
	return src(PATHS.dev.js)
		.pipe(
			rollup(
				{
					treeshake: true,
					plugins: [
						babel({ babelHelpers: 'bundled', exclude: 'node_modules' }),
						nodeResolve(),
						commonjs(),
					],
				},
				{ format: 'iife' }
			)
		)
		.pipe(uglify())
		.pipe(dest(PATHS.prod.js));
};

// = Images (dev) =
const imagesDev = () => {
	return src(PATHS.dev.img).pipe(dest(PATHS.prod.img)).pipe(browsersync.stream());
};

// = Images (prod) =
const imagesProd = () => {
	return src(PATHS.dev.img)
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.mozjpeg({ quality: 95, progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
				}),
			])
		)
		.pipe(dest(PATHS.prod.img))
		.pipe(browsersync.stream());
};

// = Fonts =
const fonts = () => {
	return src(PATHS.dev.fonts).pipe(dest(PATHS.prod.fonts)).pipe(browsersync.stream());
};

// = Exports =
exports.default = series(
	clean,
	parallel(scriptsDev, stylesDev, html, imagesDev, fonts, watchFiles, browserSync)
);

exports.build = series(clean, parallel(scriptsProd, stylesProd, html, imagesProd, fonts));

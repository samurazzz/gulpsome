const { src, dest } = require('gulp');
const imagemin = require('gulp-imagemin');
const PATHS = require('../helpers/paths');

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
		.pipe(dest(PATHS.prod.img));
};

module.exports = imagesProd;

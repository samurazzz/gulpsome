const DEV_FOLDER = '../src';
const PROD_FOLDER = '../dist';

const PATHS = {
	dev: {
		root: `${DEV_FOLDER}/`,
		html: [`src/**/*.pug`, `!src/components/**/*.pug`],
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

module.exports = PATHS;

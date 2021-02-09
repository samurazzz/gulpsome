// = Gulp =
const { parallel, series } = require('gulp');

// = Tasks =
const serve = require('./tasks/serve');
const clean = require('./tasks/clean');
const html = require('./tasks/html');
const stylesDev = require('./tasks/cssDev');
const stylesProd = require('./tasks/cssProd');
const scriptsDev = require('./tasks/jsDev');
const scriptsProd = require('./tasks/jsProd');
const imagesDev = require('./tasks/imagesDev');
const imagesProd = require('./tasks/imagesProd');
const fonts = require('./tasks/fonts');

// = Exports =
exports.default = series(clean, parallel(serve, scriptsDev, stylesDev, html, imagesDev, fonts));
exports.build = series(clean, parallel(scriptsProd, stylesProd, html, imagesProd, fonts));

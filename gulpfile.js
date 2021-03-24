
const { src, dest, parallel, watch, series } = require('gulp'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  pug = require('gulp-pug'),
  browserSync = require('browser-sync').create()

const FilesPath = { sassFiles: './src/sass/*.scss', jsFiles: './src/js/*.js', htmlFiles: './src/pug/pages/*.pug' }

function sassTask() {
  return src(FilesPath.sassFiles).pipe(sass()).pipe(concat('style.css'))
    .pipe(dest('dist/assets/css')).pipe(browserSync.stream());
}

function htmlTask() {
  return src(FilesPath.htmlFiles).pipe(pug({ pretty: true }))
    .pipe(dest('dist')).pipe(browserSync.stream());
}

function jsTask() { return src(FilesPath.jsFiles).pipe(concat('all.js')).pipe(dest('dist/assets/js')) }

function assetsTask() { return src('assets/**/*').pipe(dest('dist/assets')) }

function serve() {
  browserSync.init({ server: { baseDir: './dist' } })
  watch(FilesPath.jsFiles, jsTask);
  watch('./assets/**/*', assetsTask)
  watch(['./src/sass/*.scss', './src/sass/**/*.scss'], sassTask);
  watch('./src/pug/**/*.pug', htmlTask);
}

exports.js = jsTask;
exports.sass = sassTask;
exports.html = htmlTask; 
exports.assets = assetsTask; 
exports.default = series(parallel(htmlTask, sassTask, jsTask, assetsTask));
exports.serve = series(serve, parallel(htmlTask, sassTask, jsTask, assetsTask))


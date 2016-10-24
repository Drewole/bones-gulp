require('es6-promise').polyfill();

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;


// Default tasks
gulp.task('sass',function() {
    return gulp.src('./library/scss/**/*.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./library/css'))
    .pipe(plumber({errorHandler: onError }))
});

//Spit out errors when there are problems with the scss
var onError = function (err) {
    console.log('An error occured:', gutil.colors.magenta(err.message));
    gutil.beep();
    this.emit('end');
};

//Minify our files
gulp.task('js', function() {
    return gulp.src(['./library/js/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./library/js'))
});

//Optimize our images
gulp.task('images', function() {
  return gulp.src('./library/images/src/*')
    .pipe(plumber({errorHandler: onError}))
    .pipe(imagemin({optimizationLevel: 5, progressive: true}))
    .pipe(gulp.dest('./library/images/'));
});

//Watch the folders containing the sass files
gulp.task('watch', function() {
    var files = [
        '**/*.php',
        '**/*.{png,jpg,gif}'
    ]
  browserSync.init(files, {
    proxy: 'jrhoades.dev',
    injectChanges:true
  });
  gulp.watch('./library/scss/**/*.scss', ['sass', reload]);
  gulp.watch('./library/js/**/*.js', ['js', reload]);
  gulp.watch('./library/images/src/*', ['images', reload]);
  gulp.watch("./**/*.php").on('change', browserSync.reload);
});
gulp.task('default', ['sass','js','images','watch']);

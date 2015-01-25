/**
 * [gulp is a task automation tool]
 * find more documentation about gulp here
 * https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
 */
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    growl = require('gulp-notify-growl'),
    jscs = require('gulp-jscs-custom'),
    jshint = require('gulp-jshint');
    map = require('map-stream'),
    notify = require('gulp-notify'),
    sass = require('gulp-ruby-sass');

// SASS file path TODO: Figure out a better file structure!
var SASS_PATH = './sass/**/*.sass';
// CSS file path TODO: Figure out a better file structure!
var CSS_PATH = './css/';
var JS_PATH = './js/**/*.js';


// SASS compile to css
gulp.task('compress:css', function () {
    return gulp.src(SASS_PATH)
        .pipe(sass({
            sourcemapPath: '../sass',
            style: 'compressed'
        }))
        .on('error', function(err) {
            // This is common js, console.log are needed!
            console.log(err.message);
            gulp.src(SASS_PATH).pipe(notify({
                   "title": "Error while compiling SASS",
                   "subtitle": "Project web site",
                   "message": err.message,
                   "onLast": true,
                   "wait": true
                 }));
        })
        .pipe(gulp.dest(CSS_PATH));
});

gulp.task('autoprefixer', function () {
    return gulp.src(CSS_PATH + '**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(CSS_PATH));
});

gulp.task('jscs', function () {
    return gulp.src(JS_PATH)
        .pipe(jscs({
            esnext: false,
            configPath: '',
              // Builtins (checkstyle, console, inline, junit, text)
              // Or you can add the file path for a custom reporter
              // Defaults to console
            reporter: 'console'
        }));
});

var myReporter = map(function (file, cb) {
  if (!file.jshint.success) {
    console.log('JSHINT fail in ' + file.path);
    file.jshint.results.forEach(function (err) {
        if (err) {
            console.log(' '+file.path + ': line ' + err.line + ', col ' + err.character + ', code ' + err.code + ', ' + err.reason);
             gulp.src(JS_PATH).pipe(notify({
                 "title": "Error while linting js",
                 "subtitle": "Project web site",
                 "message": err,
                 "onLast": true,
                 "wait": true
             }));
        }

    });
  }
  cb(null, file);
});

gulp.task('lint', function() {
  return gulp.src(JS_PATH)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Watch for changes and register tasks
gulp.task('watch', function() {
    // On file change run SASS compiler
    gulp.watch(SASS_PATH, ['compress:css', 'autoprefixer']);
    // On file change run jscs and jshint cached
    gulp.watch(JS_PATH, ['jscs', 'lint']);
});

// Watch only css changes
gulp.task('watch:css', function() {
    return gulp.watch(SASS_PATH, ['compress:css', 'autoprefixer']);
});

// watch only js changes
gulp.task('watch:js', function() {
    return gulp.watch(JS_PATH, ['jscs', 'lint']);
});

/**
 * Creating 3 profiles, SASS and CSS profile/ JS developer profile/ General profile
 * Pro CSS profile: compile and watch for SASS changes
 * Pro JS profile: watch code quality tool
 * General: all Front end tasks
 */

gulp.task('default', ['compress:css', 'autoprefixer', 'lint', 'jscs', 'watch']);
gulp.task('css', ['compress:css', 'autoprefixer', 'watch:css']);
gulp.task('js', ['jscs', 'lint', 'watch:js']);
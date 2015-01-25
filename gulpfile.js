/**
 * [gulp is a task automation tool]
 * find more documentation about gulp here
 * https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md
 */
var gulp = require('gulp');
// compile sass ot css
var sass = require('gulp-ruby-sass');
//autoprefixer add bowser prefixes to the compiled css]
var autoprefixer = require('gulp-autoprefixer');
// minifyCSS minifyies and cleanup the css output
var minifyCSS = require('gulp-minify-css');

// SASS file path TODO: Figure out a better file structure!
var SASS_PATH = './sass/**/*.sass';
// CSS file path TODO: Figure out a better file structure!
var CSS_PATH = './css';


gulp.task('sass', function () {
    return gulp.src(SASS_PATH)
            .pipe(sass({
                sourcemap: false,
                sourcemapPath: '../sass',
                style: 'compressed'
            }))
            .pipe(gulp.dest(CSS_PATH));
});

// Gulp autoprefixer adds css prefixes to the css files
gulp.task('autoprefixer', function () {
    return gulp.src(CSS_PATH + '**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(CSS_PATH));
});

gulp.task('watch', function() {
  return gulp.watch(SASS_PATH, ['sass']);
 
});

// Browser sync task
gulp.task('browserSync', function () {
    return gulp.src(SASS_PATH)
        .pipe(sass({
            style: "compressed"
        }))
        .pipe(gulp.dest(CSS_PATH))// Write the CSS & Source maps
        .pipe(filter('**/*.css')) // Filtering stream to only css files
        .pipe(browserSync.reload({
            stream:true
        }));
});

/**
 * The default task if you just type gulp is call to all the tasks
 * @param  {compress:css} call the compress css task
 * @param {watch} call the watch task
 */

gulp.task('default', ['sass', 'watch']);
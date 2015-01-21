var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var watch = require('gulp-watch');


gulp.task('sass', function () {
    gulp.src('./sass/*.sass')
       .pipe(sass({sourcemapPath: '../sass'}))
       .on('error', function (err) { console.log(err.message); })
       .pipe(gulp.dest('./css'));
});

gulp.task('watch', function() {
  return gulp.watch('./sass/*.sass', ['sass']);
 
});



gulp.task('default', ['sass', 'watch']);
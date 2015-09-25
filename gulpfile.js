var gulp = require('gulp')
var babel = require('gulp-babel')
var watch = require('gulp-watch')

gulp.task('default', function() {
  return gulp.src('src/*')
    .pipe(watch('src/*'))
    .pipe(babel())
    .pipe(gulp.dest('./'))
})

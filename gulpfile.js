var gulp = require('gulp'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    paths = {
      js: 'src/**/*.js',
      less: 'src/**/*.less'
    };

gulp.task('js', function () {
  gulp.src(paths.js)
  .pipe(rename('popper.js'))
  .pipe(gulp.dest('dist/'));
});

gulp.task('js:min', function () {
  gulp.src(paths.js)
  .pipe(uglify())
  .pipe(rename('popper.min.js'))
  .pipe(gulp.dest('dist/'));
});

gulp.task('less', function () {
  gulp.src(paths.less)
  .pipe(less())
  .pipe(rename('popper.css'))
  .pipe(gulp.dest('dist/'));
});

gulp.task('less:min', function () {
  gulp.src(paths.less)
  .pipe(less())
  .pipe(minifyCss())
  .pipe(rename('popper.min.css'))
  .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['js', 'js:min', 'less', 'less:min']);
gulp.task('default', ['build']);
gulp.task('watch', ['build'], function () {
  gulp.watch('src/**/*.js', ['js', 'js:min']);
  gulp.watch('src/**/*.less', ['less', 'less:min']);
});

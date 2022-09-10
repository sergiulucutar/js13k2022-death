var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify-es').default;
var htmlMin = require('gulp-minify-html');
var sass = require('gulp-sass')(require('sass'));
var csso = require('gulp-csso');
var browserSync = require('browser-sync').create();

gulp.task('build', function () {
  return (
    gulp
      .src('./src/**/*.js')
      .pipe(concat('main.js'))
      // .pipe(uglify())
      .pipe(rename('main.js'))
      .pipe(gulp.dest('./build/'))
      .pipe(browserSync.stream())
  );
});

gulp.task('build-prod', function () {
  return gulp
    .src('./src/**/*.js')
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(rename('main.js'))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream());
});

gulp.task('copy', function () {
  return gulp
    .src('./src/**/*.html')
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream());
});

gulp.task('copy-prod', function () {
  return gulp
    .src('./src/**/*.html')
    .pipe(htmlMin())
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function () {
  return gulp
    .src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(csso())
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function () {
  browserSync.init({
    server: './build'
  });
  gulp.watch('./src/**/*.js', gulp.series('build'));
  gulp.watch('./src/**/*.scss', gulp.series('sass'));
  gulp.watch('./src/**/*.html', gulp.series('copy'));
});

gulp.task('default', gulp.series('build', 'sass', 'copy', 'watch'));

gulp.task('prod', gulp.series('build-prod', 'sass', 'copy-prod'));

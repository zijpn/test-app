var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpSequence = require('gulp-sequence');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var clean = require('gulp-clean');
var merge = require('merge-stream');

var src_path = {
  html: ['./www/*.html'],
  css: ['./www/css/**/*.css'],
  scripts: ['./www/js/**/*.js'],
  templates: ['./www/templates/**/*.html']
};

gulp.task('dist', function() {
  var mini = gulp.src(src_path.html)
    .pipe(usemin({
      css: [minifyCss()],
      js: [uglify()]
    }))
    .pipe(gulp.dest('./dist/'));
  var templ = gulp.src(src_path.templates)
    .pipe(gulp.dest('./dist/templates'));
  return merge(mini, templ);
});

gulp.task('clean', function() {
  return gulp.src('./dist', {read: false})
    .pipe(clean());
});

gulp.task('lint', function(){
  return gulp.src(src_path.scripts)
   .pipe(jshint())
   .pipe(jshint.reporter(stylish));
});

gulp.task('default', gulpSequence(['lint', 'clean'], 'dist'));

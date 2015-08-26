var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpSequence = require('gulp-sequence');
var htmlify = require('gulp-angular-htmlify');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var del = require('del');
var merge = require('merge-stream');
var browserSync = require('browser-sync');
var compress = require('compression');
var ngrok = require('ngrok');
var psi = require('psi');

var bs = null;
var ngrokPort = 3020;
var ngrokUrl  = '';

var src_path = {
  html: ['./www/*.html'],
  css: ['./www/css/**/*.css'],
  scripts: ['./www/js/**/*.js'],
  templates: ['./www/templates/**/*.html'],
  fonts: ['./www/lib/ionic/fonts/*.{ttf,woff}']
};

gulp.task('dist', function() {
  var mini = gulp.src(src_path.html)
    .pipe(htmlify())
    .pipe(usemin({
      css: [minifyCss()],
      html: [minifyHtml({empty: true})],
      js: [uglify({mangle: false})],
      lib: [uglify({mangle: false})]
    }))
    .pipe(gulp.dest('./dist/'));
  var templ = gulp.src(src_path.templates)
    .pipe(minifyHtml({empty: true}))
    .pipe(gulp.dest('./dist/templates/'));
  var fonts = gulp.src(src_path.fonts)
    .pipe(gulp.dest('./dist/fonts/'));
  var icon = gulp.src('./www/favicon.ico')
    .pipe(gulp.dest('./dist/'));
  return merge(mini, templ, fonts);
});

gulp.task('clean', function() {
  del(['./dist/**/*']);
});

gulp.task('lint', function() {
  return gulp.src(src_path.scripts)
   .pipe(jshint())
   .pipe(jshint.reporter(stylish));
});

gulp.task('serve', function() {
  bs = browserSync({
    port: ngrokPort,
    open: false,
    server: {
      baseDir: './dist',
      middleware: [compress()]
    }
  });
});

gulp.task('ngrok', ['serve'], function(cb) {
  return ngrok.connect({
    port: ngrokPort
  }, function (err, url) {
    ngrokUrl = url;
    gutil.log('Serving tunnel from ' + url);
    cb();
  });
});

gulp.task('psi-desktop', function(cb) {
  return psi.output(ngrokUrl, {
    nokey: 'true',
    strategy: 'desktop',
    threshold: 1
  }, cb);
});

gulp.task('psi-mobile', function(cb) {
  return psi.output(ngrokUrl, {
    nokey: 'true',
    strategy: 'mobile',
    threshold: 1
  }, cb);
});

gulp.task('psi-seq', function(cb) {
  return gulpSequence(
    'ngrok',
    'psi-desktop',
    'psi-mobile',
    cb);
});

gulp.task('psi', ['psi-seq'], function() {
  if (bs) {
    gutil.log('Stop browser sync');
    bs.exit();
  }
});

gulp.task('default', gulpSequence(['lint', 'clean'], 'dist'));

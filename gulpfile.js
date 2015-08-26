var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpSequence = require('gulp-sequence');

var merge = require('merge-stream');
var webserver = require('gulp-webserver');
var ngrok = require('ngrok');
var psi = require('psi');

var distServ = null;
var distPort = 3000;
var publicUrl = '';

var src_path = {
  html: ['./www/*.html'],
  css: ['./www/css/**/*.css'],
  scripts: ['./www/js/**/*.js'],
  templates: ['./www/templates/**/*.html'],
  fonts: ['./www/lib/ionic/fonts/*.{ttf,woff}']
};

gulp.task('dist', function() {
  var htmlify = require('gulp-angular-htmlify');
  var usemin = require('gulp-usemin');
  var minifyCss = require('gulp-minify-css');
  var minifyHtml = require('gulp-minify-html');
  var uglify = require('gulp-uglify');
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
  return merge(mini, templ, fonts, icon);
});

gulp.task('clean', function(cb) {
  var del = require('del');
  del(['./dist/**/*'], cb);
});

gulp.task('lint', function() {
  var jshint = require('gulp-jshint');
  var stylish = require('jshint-stylish');
  return gulp.src(src_path.scripts)
   .pipe(jshint())
   .pipe(jshint.reporter(stylish));
});

gulp.task('serve', function() {
  var compress = require('compression');
  var cache = require('cache-control');
  distServ = gulp.src('dist')
    .pipe(webserver({
      port: distPort,
      middleware: [compress(), cache()]
    }));
  return distServ;
});

gulp.task('ngrok', ['serve'], function(cb) {
  return ngrok.connect({
    port: distPort
  }, function (err, url) {
    publicUrl = url;
    gutil.log('Forwarding ' + url.replace('https', 'http(s)') + ' -> http://localhost:' + distPort);
    cb();
  });
});

gulp.task('psi-desktop', function(cb) {
  return psi.output(publicUrl, {
    nokey: 'true',
    strategy: 'desktop',
    threshold: 1
  }, cb);
});

gulp.task('psi-mobile', function(cb) {
  return psi.output(publicUrl, {
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
  gutil.log('Disconnect ngrok');
  ngrok.disconnect();
  if (distServ) {
    gutil.log('Stop web server');
    distServ.emit('kill');
  }
});

gulp.task('default', gulpSequence(['lint', 'clean'], 'dist'));

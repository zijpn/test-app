var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpSequence = require('gulp-sequence');

var merge = require('merge-stream');
var browserSync = require('browser-sync');
var ngrok = require('ngrok');
var psi = require('psi');

var ngrokPort = 3000;
var ngrokUrl  = '';

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

gulp.task('serve', function(cb) {
  var compress = require('compression');
  var opts = {
    port: ngrokPort,
    open: false,
    server: {
      baseDir: './dist',
      middleware: [compress()]
    }
  };
  var bs = browserSync.create('Dist Server');
  bs.init(opts, cb);
});

gulp.task('ngrok', ['serve'], function(cb) {
  return ngrok.connect({
    port: ngrokPort
  }, function (err, url) {
    ngrokUrl = url;
    gutil.log('Forwarding ' + url + ' -> http://localhost:' + ngrokPort);
    gutil.log('Forwarding ' + url.replace('https', 'http') + ' -> http://localhost:' + ngrokPort);
    gutil.log('Web console at http://localhost:4040');
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
  var bs = browserSync.get('Dist Server');
  if (bs) {
    gutil.log('Exit ' + bs.name);
    bs.exit();
  }
});

gulp.task('default', gulpSequence(['lint', 'clean'], 'dist'));

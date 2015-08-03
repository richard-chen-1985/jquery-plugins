var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-minify-css');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Minify JS
gulp.task('minify', function(){
  return gulp.src(['js/prefix.js', 'js/sharePop.js', 'js/shareTip.js', 'js/share.js', 'js/suffix.js'])
    .pipe(concat('jquery.share.js'))
    .pipe(gulp.dest('dist'))
    .pipe(rename({extname: '.min.js'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
  del(['dist/**', 'css/**'], cb);
});

gulp.task('sass', function () {
    return gulp.src('sass/jquery.share.scss')
        .pipe(sass({sourcemap: true, sourcemapPath: 'css'}))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('css'))
        .pipe(reload({stream:true}))
        .pipe(rename({extname: '.min.css'}))
        .pipe(cssmin({compatibility: 'ie8'}))
        .pipe(gulp.dest('css'));
});

gulp.task('lint', function() {
  return gulp.src(['dist/jquery.sharepop.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            //directory: true,
            index: 'index.html'
        },
        reloadDelay: 2000,
        // rewriteRules: [
        //     {
        //         match: /static/g,
        //         fn: function(match) {
        //             return 'public'
        //         }
        //     }
        // ]
    });

    gulp.watch("index.html").on("change", browserSync.reload);
});

gulp.task('default', ['sass', 'minify', 'lint', 'browser-sync'], function () {
    gulp.watch("sass/**/*.scss", ['sass']);
    gulp.watch('js/**/*.js', ['lint', 'minify']);
});

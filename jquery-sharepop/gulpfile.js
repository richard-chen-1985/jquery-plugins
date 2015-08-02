var gulp = require('gulp');
var sass = require('gulp-sass');
var del = require('del');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Minify JS
gulp.task('minify', function(){
  return gulp.src('src/**/*.js')
    .pipe(gulp.dest('dist'))
    .pipe(rename({extname: '.min.js'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function (cb) {
  del(['dist/**'], cb);
});

gulp.task('sass', function () {
    return gulp.src('src/style.scss')
        .pipe(sass({sourcemap: true, sourcemapPath: '../scss'}))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('dist'))
        .pipe(reload({stream:true}));
});

gulp.task('lint', function() {
  return gulp.src(['src/jquery.sharepop.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('copyHtml', function() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('copyImg', function() {
    return gulp.src('src/img/**')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist",
            directory: true,
            index: 'index.html'
        },
        reloadDelay: 2000,
        rewriteRules: [
            {
                match: /static/g,
                fn: function(match) {
                    return 'public'
                }
            }
        ]
    });

    gulp.watch("dist/**").on("change", browserSync.reload);
});

gulp.task('default', ['sass', 'minify', 'copyHtml', 'copyImg', 'browser-sync'], function () {
    gulp.watch("src/**/*.scss", ['sass']);
    gulp.watch('src/**/*.js', ['lint', 'minify']);
    gulp.watch('src/index.html', ['copyHtml']);
    gulp.watch('src/img/**', ['copyImg']);
});

gulp.task('build', ['clean', 'sass', 'minify', 'copyHtml', 'copyImg', 'lint']);

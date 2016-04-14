// run <$ gulp>  for development loop
// then run <$ gulp deploy>  to push to gh-pages

var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    uglify = require('gulp-uglify'),
    concatenate = require('gulp-concat'),
    sourcemap = require('gulp-sourcemaps'),
    imgmin = require('gulp-imagemin'),
    cssmin = require('gulp-cssnano'),
    htmlmin = require('gulp-htmlmin');

var ghPages = require('gulp-gh-pages');

gulp.task('deploy', function() {
    return gulp.src('./build/**/*')
        .pipe(ghPages());
});

gulp.task('content', function(){
    gulp.src('./index.html')
        .pipe(gulp.dest('./build/'))
        .pipe(reload({stream:true}))
});

gulp.task('scripts', function(){
    gulp.src('./js/*.js')
        .pipe(sourcemap.init())
        .pipe(uglify())
        .pipe(concatenate('app.js'))
        .pipe(sourcemap.write())
        .pipe(gulp.dest('./build/js/'))
        .pipe(reload({stream:true}))
});

gulp.task('styles', function(){
    gulp.src('./css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('./build/css/'))
        .pipe(reload({stream:true}))
});

gulp.task('pictures', function(){
    gulp.src('./img/*.png')
        .pipe(imgmin())
        .pipe(gulp.dest('./build/img/'))
        .pipe(reload({stream:true}))
});

gulp.task('serve', function(){
    browserSync.init({
        server: {
            baseDir: './build/'
        }
    });
    gulp.watch('./index.html', ['content']);
    gulp.watch('./js/*.js', ['scripts']);
    gulp.watch('./css/*.css', ['styles']);
});

gulp.task('default', ['content','scripts','styles','pictures','serve']);

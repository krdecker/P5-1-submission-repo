
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concatenate = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    cssnano = require('gulp-cssnano'),
    htmlmin = require('gulp-htmlmin');

var ghPages = require('gulp-gh-pages');
 
gulp.task('deploy', function() {
    return gulp.src('./build/**/*')
        .pipe(ghPages());
});

// Paths to various files
var paths = {
    scripts: ['js/*.js'],
    styles: ['css/*.css'],
    images: ['img/**/*'],
    content: ['index.html']
}
 
gulp.task('styles', function() {
    return gulp.src(paths.styles)
        .pipe(cssnano())
        .pipe(gulp.dest('./build/css/'))
});


// Concats & minifies js files and outputs them to build/js/app.js 
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(concatenate('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/js/'));
});

// Minifies our HTML files and outputs them to build/*.html
gulp.task('content', function() {
    return gulp.src(paths.content)
        .pipe(htmlmin({
            empty: true,
            quotes: true
        }))
        .pipe(gulp.dest('./build'))
});

// Optimizes our image files and outputs them to build/image/*
gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest('./build/img'))
})

// Watches for changes to our files and executes required scripts
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.content, ['content']); 
    gulp.watch(paths.images, ['images']);
});

// Launches a test webserver
gulp.task('webserver', function() {
    gulp.src('build')
        .pipe(webserver({
            livereload: true,
            port: 1111
        }));
});

gulp.task('build', ['styles','scripts','content','images']);

gulp.task('default', ['watch']);

// , 'webserver']);



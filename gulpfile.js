'use strict';

var gulp = require('gulp');

gulp.task('css', function () {
    var sass = require('gulp-sass');
    var postcss = require('gulp-postcss');
    var autoprefixer = require('autoprefixer');

    return gulp.src('./asset/sass/*.scss')
        .pipe(sass({
            outputStyle: 'compressed',
            includePaths: ['node_modules/susy/sass']
        }).on('error', sass.logError))
        .pipe(postcss([
            autoprefixer({browsers: ['> 5%', '> 5% in US', 'last 2 versions']})
        ]))
        .pipe(gulp.dest('./asset/css'));
});

gulp.task('css:watch', function () {
    gulp.watch('./asset/sass/*.scss', ['css']);
});

gulp.task('move', function(){
    // copy required javascript from npm folders
    gulp.src('./node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('./asset/js'));
    gulp.src('./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js')
        .pipe(gulp.dest('./asset/js'));
    gulp.src('./node_modules/popper.js/dist/popper.min.js')
        .pipe(gulp.dest('./asset/js'));
    // copy required css from npm folders
    gulp.src('./node_modules/bootstrap/dist/css/bootstrap.min.css')
        .pipe(gulp.dest('./asset/css'));
});

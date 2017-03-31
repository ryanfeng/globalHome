var gulp = require('gulp'),
    sass = require("gulp-sass"),
    minifyCss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush');

gulp.task('default', function(){
    gulp.run('js', 'sass');
    gulp.watch('./sass/**/*.scss', ['sass']);
    gulp.watch('dist/js/common.js', ['js']);
});

gulp.task('sass', function () {
    return gulp.src('./sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/css/'))
        .pipe(minifyCss())
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('js', function () {
    return gulp.src(['dist/js/plugin/sha1/*.js', 'dist/js/common.js'])
        .pipe(concat('common.min.js'))
        .pipe(gulp.dest('dist/js/'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'))
        .pipe(notify({message: 'js task ok'}));
});

// 压缩图片
gulp.task('img', function() {
    return gulp.src('dist/images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngcrush()]
        }))
        .pipe(gulp.dest('dist/images/'))
        .pipe(notify({ message: 'img task ok' }));
});

var gulp = require('gulp');

var del = require('del'),
    sass = require('gulp-sass'),
    gulpIf = require('gulp-if'),
    cache = require('gulp-cache'),
    uglify = require('gulp-uglify'),
    useref = require('gulp-useref'),
    replace = require('gulp-replace'),
    plumber = require('gulp-plumber'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    livereload = require('gulp-livereload');

/*
 *
 * DEVELOPMENT BUILDER
 *
 */

var onError = function (err) {
  console.log(err);
  this.emit('end');
};

gulp.task('sass', function() {
  return gulp.src('src/scss/*.scss')
    .pipe(plumber({errorHandler: onError}))
    .pipe(sass())
    .pipe(gulp.dest('src/css'))
    .pipe(livereload());
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(livereload());
});

gulp.task('php', function() {
  return gulp.src('src/*.php')
    .pipe(livereload());
});

gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe(plumber({errorHandler: onError}))
    .pipe(livereload());
});

gulp.task('watch', ['sass','html','php','js'], function (){
  livereload.listen();

  //Watch SCSS files
  gulp.watch('src/scss/**/*.scss', ['sass']);

  //Watch Javascripts files
  gulp.watch('src/js/*.js', ['js']);

  //Watch HTML file
  gulp.watch('src/*.html', ['html']);

  //Watch PHP file
  gulp.watch('src/**/*.php', ['php']);  
});


/*
 *
 * DISTIBRUTION BUILDER
 *
 */

gulp.task('another-files:src', function() {
  return gulp.src(['src/**/*.json','src/**/*.xml'])
  .pipe(gulp.dest('dist'))
 });

gulp.task('useref', function(cb){
  return gulp.src('src/**/*.php')
    .pipe( gulpIf('*/header.php', replace('href="css','href="../css') ) )
    .pipe( gulpIf('*/header.php', replace('src="js','src="../js') ) )
    .pipe(useref())
    // Minifies only if it's a JS file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

gulp.task('images', function(){
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

gulp.task('videos', function(){
  return gulp.src('src/videos/**/*.+(mp4|mov|ogg|avi|3gp|webm)')
  .pipe(gulp.dest('dist/videos'))
});

gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('files', function() {
  return gulp.src('src/files/**/*')
  .pipe(gulp.dest('dist/files'))
});

gulp.task('hta', function() {
  return gulp.src('src/.htaccess')
  .pipe(gulp.dest('dist'))
});

gulp.task('txt', function() {
  return gulp.src('src/**/*.txt')
  .pipe(gulp.dest('dist'))
});


gulp.task('phpfile', function() {
  return gulp.src('src/**/*.php')
  .pipe(gulp.dest('dist'))
});

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

gulp.task('build', function(callback) {
  runSequence(['clean:dist','sass','phpfile'],
    ['useref','images','videos','fonts','files','another-files:src','hta','txt'],
    callback
  )
});
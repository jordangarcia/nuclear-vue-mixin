var gulp = require('gulp')
var connect = require('gulp-connect')

gulp.task('default', function() {
  connect.server({
    root: 'example',
    port: 8004
  })
})

import clean from 'gulp-clean'

export default class GulpWrapper {
  constructor(gulp) {
    this._gulp = gulp
  }

  defineCleanTask(taskName, glob) {
    let gulp = this._gulp
    
    gulp.task(taskName, () => {
      return gulp.src(glob, {read: false, allowEmpty: true})
        .pipe(clean());
    })
  }

  defineDestinationTask(taskName, {globIn, pipes, outDir}) {
    let gulp = this._gulp

    gulp.task(taskName, () => {
      let stream = gulp.src(globIn)

      pipes.forEach(pipe => stream = stream.pipe(pipe()))

      return stream.pipe(gulp.dest(outDir))
    })
  }

  defineSubtask(taskName, parentTask, task) {
    let gulp = this._gulp

    gulp.task(taskName, parentTask, task)
  }

  defineParallelSubtask(taskName, parentTasksNames, task) {
    let gulp = this._gulp
    let parentTask = gulp.parallel(parentTasksNames)

    gulp.task(taskName, parentTask, task)
  }

  defineSerialSubtask(taskName, parentTasksNames, task) {
    let gulp = this._gulp
    let parentTask = gulp.series(parentTasksNames)

    gulp.task(taskName, parentTask, task)
  }

  defineTask(taskName, task) {
    this.defineSubtask(taskName, task)
  }

  defineParallelTask(taskName, parentTasksNames) {
    this.defineParallelSubtask(taskName, parentTasksNames)
  }

  defineSerialTask(taskName, parentTasksNames) {
    this.defineSerialSubtask(taskName, parentTasksNames)
  }

  createWatcher(glob, taskToExecute) {
    let gulp = this._gulp
    let watcher = gulp.watch(glob, gulp.series(taskToExecute))
    // watcher.on('change', logFileChanged)
  }

  src(...args) {
    let gulp = this._gulp

    return gulp.src.apply(gulp, args)
  }

  dest(...args) {
    let gulp = this._gulp

    return gulp.dest.apply(gulp, args)
  }
}

export function infectBrowserSyncTasks(configuration, tasks) {
  let options = configuration.get('options')
  let useBrowserSync = options.get('useBrowserSync')

  let infectedTasks = tasks

  if (useBrowserSync) {
    infectedTasks = tasks.concat('browser-sync:reload')
  }

  return infectedTasks
}

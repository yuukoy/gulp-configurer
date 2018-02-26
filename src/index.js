import Configuration from './configuration'
import GulpTaskConfigurer from './task/gulp-task-configurer'

export default function createConfigurator(userOptions) {
  return function () {
    try {
      let configuration = new Configuration(userOptions)
      let configurer = new GulpTaskConfigurer(configuration)

      configurer.configure()
    }
    catch(e) {
      console.log(e)
    }
  }
}

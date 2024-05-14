import { App } from 'vue'
import VxeFormComponent from './src/form'

export const VxeForm = Object.assign(VxeFormComponent, {
  install (app: App) {
    app.component(VxeFormComponent.name as string, VxeFormComponent)
  }
})

export const Form = VxeForm
export default VxeForm

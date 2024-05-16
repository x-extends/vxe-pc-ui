import { App } from 'vue'
import VxeTextareaComponent from './src/textarea'
import { dynamicApp } from '../dynamics'

export const VxeTextarea = Object.assign(VxeTextareaComponent, {
  install: function (app: App) {
    app.component(VxeTextareaComponent.name as string, VxeTextareaComponent)
  }
})

dynamicApp.component(VxeTextareaComponent.name as string, VxeTextareaComponent)

export const Textarea = VxeTextarea
export default VxeTextarea

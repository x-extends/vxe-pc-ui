import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeTextareaComponent from './src/textarea'
import { dynamicApp } from '../dynamics'

export const VxeTextarea = Object.assign(VxeTextareaComponent, {
  install: function (app: VueConstructor) {
    app.component(VxeTextareaComponent.name as string, VxeTextareaComponent)
  }
})

dynamicApp.use(VxeTextarea)
VxeUI.component(VxeTextareaComponent)

export const Textarea = VxeTextarea
export default VxeTextarea

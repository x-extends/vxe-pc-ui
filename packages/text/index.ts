import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeTextComponent from './src/text'

export const VxeText = Object.assign({}, VxeTextComponent, {
  install (app: VueConstructor) {
    app.component(VxeTextComponent.name as string, VxeTextComponent)
  }
})

dynamicApp.use(VxeText)
VxeUI.component(VxeTextComponent)

export const Text = VxeText
export default VxeText

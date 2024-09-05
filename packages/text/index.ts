import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeTextComponent from './src/text'

export const VxeText = Object.assign({}, VxeTextComponent, {
  install (app: VueConstructor) {
    app.component(VxeTextComponent.name as string, VxeTextComponent)
  }
})

VxeUI.component(VxeTextComponent)

export const Text = VxeText
export default VxeText

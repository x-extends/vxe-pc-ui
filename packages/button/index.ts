import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeButtonComponent from './src/button'

export const VxeButton = Object.assign({}, VxeButtonComponent, {
  install (app: VueConstructor) {
    app.component(VxeButtonComponent.name, VxeButtonComponent)
  }
})

VxeUI.component(VxeButtonComponent)

export const Button = VxeButton
export default VxeButton

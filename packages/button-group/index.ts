import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeButtonGroupComponent from '../button/src/button-group'

export const VxeButtonGroup = Object.assign({}, VxeButtonGroupComponent, {
  install (app: VueConstructor) {
    app.component(VxeButtonGroupComponent.name, VxeButtonGroupComponent)
  }
})

VxeUI.component(VxeButtonGroupComponent)

export const ButtonGroup = VxeButtonGroup
export default VxeButtonGroup

import { App } from 'vue'
import VxeButtonGroupComponent from '../button/src/button-group'

const VxeButtonGroup = Object.assign({}, VxeButtonGroupComponent, {
  install (app: App) {
    app.component(VxeButtonGroupComponent.name as string, VxeButtonGroupComponent)
  }
})

export const ButtonGroup = VxeButtonGroup
export default VxeButtonGroup

import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeSwitchComponent from './src/switch'

export const VxeSwitch = Object.assign(VxeSwitchComponent, {
  install: function (app: VueConstructor) {
    app.component(VxeSwitchComponent.name as string, VxeSwitchComponent)
  }
})

VxeUI.component(VxeSwitchComponent)

export const Switch = VxeSwitch
export default VxeSwitch

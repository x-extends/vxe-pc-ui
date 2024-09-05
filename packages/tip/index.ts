import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeTipComponent from './src/tip'

export const VxeTip = Object.assign({}, VxeTipComponent, {
  install (app: VueConstructor) {
    app.component(VxeTipComponent.name as string, VxeTipComponent)
    app.component('VxeTipsComponent' as string, VxeTipComponent)
  }
})

VxeUI.component(VxeTipComponent)

export const Tips = VxeTip
export const Tip = VxeTip

export default VxeTip

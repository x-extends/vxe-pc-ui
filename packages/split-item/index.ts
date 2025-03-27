import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeSplitItemComponent from '../split/src/split-item'
import { dynamicApp } from '../dynamics'

export const VxeSplitItem = Object.assign({}, VxeSplitItemComponent, {
  install (app: VueConstructor) {
    app.component(VxeSplitItemComponent.name as string, VxeSplitItemComponent)
  }
})

dynamicApp.use(VxeSplitItem)
VxeUI.component(VxeSplitItemComponent)

export const SplitItem = VxeSplitItem
export default VxeSplitItem

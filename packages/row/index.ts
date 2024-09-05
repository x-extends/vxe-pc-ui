import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeRowComponent from './src/row'

export const VxeRow = Object.assign({}, VxeRowComponent, {
  install (app: VueConstructor) {
    app.component(VxeRowComponent.name as string, VxeRowComponent)
  }
})

VxeUI.component(VxeRowComponent)

export const Row = VxeRow
export default VxeRow

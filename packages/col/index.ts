import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeColComponent from '../row/src/col'

export const VxeCol = Object.assign({}, VxeColComponent, {
  install (app: VueConstructor) {
    app.component(VxeColComponent.name as string, VxeColComponent)
  }
})

VxeUI.component(VxeColComponent)

export const Col = VxeCol
export default VxeCol

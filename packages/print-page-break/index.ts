import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxePrintPageBreakComponent from '../print/src/page-break'

export const VxePrintPageBreak = Object.assign({}, VxePrintPageBreakComponent, {
  install (app: VueConstructor) {
    app.component(VxePrintPageBreakComponent.name as string, VxePrintPageBreakComponent)
  }
})

VxeUI.component(VxePrintPageBreakComponent)

export const PrintPageBreak = VxePrintPageBreak
export default VxePrintPageBreak

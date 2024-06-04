import { App } from 'vue'
import VxePrintPageBreakComponent from '../print/src/page-break'
import { dynamicApp } from '../dynamics'

export const VxePrintPageBreak = Object.assign({}, VxePrintPageBreakComponent, {
  install (app: App) {
    app.component(VxePrintPageBreakComponent.name as string, VxePrintPageBreakComponent)
  }
})

dynamicApp.component(VxePrintPageBreakComponent.name as string, VxePrintPageBreakComponent)

export const PrintPageBreak = VxePrintPageBreak
export default VxePrintPageBreak

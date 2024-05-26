import { App } from 'vue'
import VxePrintComponent from './src/print'
import { dynamicApp } from '../dynamics'
import { VxeUI } from '@vxe-ui/core'
import { printHtml } from './src/util'

export const VxePrint = Object.assign({}, VxePrintComponent, {
  install (app: App) {
    app.component(VxePrintComponent.name as string, VxePrintComponent)
    VxeUI.print = printHtml
  }
})

dynamicApp.component(VxePrintComponent.name as string, VxePrintComponent)

export const Print = VxePrint
export default VxePrint

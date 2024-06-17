import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeRowComponent from './src/row'
import { dynamicApp } from '../dynamics'

export const VxeRow = Object.assign({}, VxeRowComponent, {
  install (app: App) {
    app.component(VxeRowComponent.name as string, VxeRowComponent)
    VxeUI.component(VxeRowComponent)
  }
})

dynamicApp.component(VxeRowComponent.name as string, VxeRowComponent)

export const Row = VxeRow
export default VxeRow

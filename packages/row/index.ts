import { App } from 'vue'
import VxeRowComponent from './src/row'
import { dynamicApp } from '../dynamics'

export const VxeRow = Object.assign({}, VxeRowComponent, {
  install (app: App) {
    app.component(VxeRowComponent.name as string, VxeRowComponent)
  }
})

dynamicApp.component(VxeRowComponent.name as string, VxeRowComponent)

export const Row = VxeRow
export default VxeRow

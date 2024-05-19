import { App } from 'vue'
import VxeTreeSelectComponent from './src/tree-select'
import { dynamicApp } from '../dynamics'

const VxeTreeSelect = Object.assign({}, VxeTreeSelectComponent, {
  install (app: App) {
    app.component(VxeTreeSelectComponent.name as string, VxeTreeSelectComponent)
  }
})

dynamicApp.component(VxeTreeSelectComponent.name as string, VxeTreeSelectComponent)

export const TreeSelect = VxeTreeSelect
export default VxeTreeSelect

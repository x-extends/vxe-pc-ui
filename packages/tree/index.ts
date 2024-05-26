import { App } from 'vue'
import VxeTreeComponent from './src/tree'
import { dynamicApp } from '../dynamics'

export const VxeTree = Object.assign({}, VxeTreeComponent, {
  install (app: App) {
    app.component(VxeTreeComponent.name as string, VxeTreeComponent)
  }
})

dynamicApp.component(VxeTreeComponent.name as string, VxeTreeComponent)

export const Tree = VxeTree
export default VxeTree

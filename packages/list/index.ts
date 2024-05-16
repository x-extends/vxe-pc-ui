import { App } from 'vue'
import VxeListComponent from './src/list'
import { dynamicApp } from '../dynamics'

export const VxeList = Object.assign(VxeListComponent, {
  install (app: App) {
    app.component(VxeListComponent.name as string, VxeListComponent)
  }
})

dynamicApp.component(VxeListComponent.name as string, VxeListComponent)

export const List = VxeList
export default VxeList

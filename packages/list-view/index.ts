import { App } from 'vue'
import VxeListViewComponent from '../list-design/src/list-view'
import { dynamicApp } from '../dynamics'

export const VxeListView = Object.assign(VxeListViewComponent, {
  install: function (app: App) {
    app.component(VxeListViewComponent.name as string, VxeListViewComponent)
  }
})

dynamicApp.component(VxeListViewComponent.name as string, VxeListViewComponent)

export const ListView = VxeListView
export default VxeListView

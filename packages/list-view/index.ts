import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeListViewComponent from '../list-design/src/list-view'
import { dynamicApp } from '../dynamics'

export const VxeListView = Object.assign(VxeListViewComponent, {
  install: function (app: App) {
    app.component(VxeListViewComponent.name as string, VxeListViewComponent)
    VxeUI.component(VxeListViewComponent)
  }
})

dynamicApp.component(VxeListViewComponent.name as string, VxeListViewComponent)

export const ListView = VxeListView
export default VxeListView

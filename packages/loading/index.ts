import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeLoadingComponent from './src/loading'
import { dynamicApp } from '../dynamics'

export const VxeLoading = Object.assign({}, VxeLoadingComponent, {
  install (app: App) {
    app.component(VxeLoadingComponent.name as string, VxeLoadingComponent)
  }
})

dynamicApp.component(VxeLoadingComponent.name as string, VxeLoadingComponent)
VxeUI.component(VxeLoadingComponent)

export const Loading = VxeLoading
export default VxeLoading

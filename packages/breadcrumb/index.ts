import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeBreadcrumbComponent from './src/breadcrumb'

export const VxeBreadcrumb = Object.assign({}, VxeBreadcrumbComponent, {
  install (app: VueConstructor) {
    app.component(VxeBreadcrumbComponent.name as string, VxeBreadcrumbComponent)
  }
})

dynamicApp.use(VxeBreadcrumb)
VxeUI.component(VxeBreadcrumbComponent)

export const Breadcrumb = VxeBreadcrumb
export default VxeBreadcrumb

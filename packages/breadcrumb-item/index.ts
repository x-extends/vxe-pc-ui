import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeBreadcrumbItemComponent from '../breadcrumb/src/breadcrumb-item'

export const VxeBreadcrumbItem = Object.assign({}, VxeBreadcrumbItemComponent, {
  install (app: VueConstructor) {
    app.component(VxeBreadcrumbItemComponent.name as string, VxeBreadcrumbItemComponent)
  }
})

dynamicApp.use(VxeBreadcrumbItem)
VxeUI.component(VxeBreadcrumbItemComponent)

export const BreadcrumbItem = VxeBreadcrumbItem
export default VxeBreadcrumbItem

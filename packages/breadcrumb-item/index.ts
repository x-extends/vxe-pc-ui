import { App } from 'vue'
import VxeBreadcrumbItemComponent from './src/breadcrumb-item'
import { dynamicApp } from '../dynamics'

export const VxeBreadcrumbItem = Object.assign({}, VxeBreadcrumbItemComponent, {
  install (app: App) {
    app.component(VxeBreadcrumbItemComponent.name as string, VxeBreadcrumbItemComponent)
  }
})

dynamicApp.component(VxeBreadcrumbItemComponent.name as string, VxeBreadcrumbItemComponent)

export const BreadcrumbItem = VxeBreadcrumbItem
export default VxeBreadcrumbItem

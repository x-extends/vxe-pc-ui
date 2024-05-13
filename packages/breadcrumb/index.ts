import { App } from 'vue'
import VxeBreadcrumbComponent from './src/breadcrumb'

const VxeBreadcrumb = Object.assign({}, VxeBreadcrumbComponent, {
  install (app: App) {
    app.component(VxeBreadcrumbComponent.name as string, VxeBreadcrumbComponent)
  }
})

export const Breadcrumb = VxeBreadcrumb
export default VxeBreadcrumb

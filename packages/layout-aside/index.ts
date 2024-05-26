import { App } from 'vue'
import VxeLayoutAsideComponent from './src/layout-aside'
import { dynamicApp } from '../dynamics'

export const VxeLayoutAside = Object.assign({}, VxeLayoutAsideComponent, {
  install (app: App) {
    app.component(VxeLayoutAsideComponent.name as string, VxeLayoutAsideComponent)
  }
})

dynamicApp.component(VxeLayoutAsideComponent.name as string, VxeLayoutAsideComponent)

export const LayoutAside = VxeLayoutAside
export default VxeLayoutAside

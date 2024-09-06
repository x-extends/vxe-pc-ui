import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeLayoutAsideComponent from './src/layout-aside'

export const VxeLayoutAside = Object.assign({}, VxeLayoutAsideComponent, {
  install (app: VueConstructor) {
    app.component(VxeLayoutAsideComponent.name as string, VxeLayoutAsideComponent)
  }
})

dynamicApp.use(VxeLayoutAside)
VxeUI.component(VxeLayoutAsideComponent)

export const LayoutAside = VxeLayoutAside
export default VxeLayoutAside

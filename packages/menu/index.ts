import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeMenuComponent from './src/menu'

export const VxeMenu = Object.assign({}, VxeMenuComponent, {
  install (app: VueConstructor) {
    app.component(VxeMenuComponent.name as string, VxeMenuComponent)
  }
})

dynamicApp.use(VxeMenu)
VxeUI.component(VxeMenuComponent)

export const Menu = VxeMenu
export default VxeMenu

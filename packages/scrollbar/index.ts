import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeScrollbarComponent from './src/scrollbar'
import { dynamicApp } from '../dynamics'

export const VxeScrollbar = Object.assign({}, VxeScrollbarComponent, {
  install (app: VueConstructor) {
    app.component(VxeScrollbarComponent.name as string, VxeScrollbarComponent)
  }
})

dynamicApp.use(VxeScrollbar)
VxeUI.component(VxeScrollbarComponent)

export const Scrollbar = VxeScrollbar
export default VxeScrollbar

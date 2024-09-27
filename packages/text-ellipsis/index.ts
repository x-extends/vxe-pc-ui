import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeTextEllipsisComponent from './src/text-ellipsis'

export const VxeTextEllipsis = Object.assign({}, VxeTextEllipsisComponent, {
  install (app: VueConstructor) {
    app.component(VxeTextEllipsisComponent.name as string, VxeTextEllipsisComponent)
  }
})

dynamicApp.use(VxeTextEllipsis)
VxeUI.component(VxeTextEllipsisComponent)

export const TextEllipsis = VxeTextEllipsis
export default VxeTextEllipsis

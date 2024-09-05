import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeLinkComponent from './src/link'

export const VxeLink = Object.assign({}, VxeLinkComponent, {
  install (app: VueConstructor) {
    app.component(VxeLinkComponent.name as string, VxeLinkComponent)
  }
})

VxeUI.component(VxeLinkComponent)

export const Link = VxeLink
export default VxeLink

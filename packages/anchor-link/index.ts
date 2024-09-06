import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeAnchorLinkComponent from '../anchor/src/anchor-link'

export const VxeAnchorLink = Object.assign({}, VxeAnchorLinkComponent, {
  install (app: VueConstructor) {
    app.component(VxeAnchorLinkComponent.name as string, VxeAnchorLinkComponent)
  }
})

dynamicApp.use(VxeAnchorLink)
VxeUI.component(VxeAnchorLinkComponent)

export const AnchorLink = VxeAnchorLink
export default VxeAnchorLink

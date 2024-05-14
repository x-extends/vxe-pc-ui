import { App } from 'vue'
import VxeAnchorLinkComponent from '../anchor/src/anchor-link'

const VxeAnchorLink = Object.assign({}, VxeAnchorLinkComponent, {
  install (app: App) {
    app.component(VxeAnchorLinkComponent.name as string, VxeAnchorLinkComponent)
  }
})

export const AnchorLink = VxeAnchorLink
export default VxeAnchorLink

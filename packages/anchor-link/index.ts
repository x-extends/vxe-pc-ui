import { App } from 'vue'
import VxeAnchorLinkComponent from '../anchor/src/anchor-link'
import { dynamicApp } from '../dynamics'

const VxeAnchorLink = Object.assign({}, VxeAnchorLinkComponent, {
  install (app: App) {
    app.component(VxeAnchorLinkComponent.name as string, VxeAnchorLinkComponent)
  }
})

dynamicApp.component(VxeAnchorLinkComponent.name as string, VxeAnchorLinkComponent)

export const AnchorLink = VxeAnchorLink
export default VxeAnchorLink

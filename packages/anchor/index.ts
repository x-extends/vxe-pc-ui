import { App } from 'vue'
import VxeAnchorComponent from './src/anchor'
import { dynamicApp } from '../dynamics'

const VxeAnchor = Object.assign({}, VxeAnchorComponent, {
  install (app: App) {
    app.component(VxeAnchorComponent.name as string, VxeAnchorComponent)
  }
})

dynamicApp.component(VxeAnchorComponent.name as string, VxeAnchorComponent)

export const Anchor = VxeAnchor
export default VxeAnchor

import { App } from 'vue'
import VxeTagComponent from './src/tag'
import { dynamicApp } from '../dynamics'

export const VxeTag = Object.assign({}, VxeTagComponent, {
  install (app: App) {
    app.component(VxeTagComponent.name as string, VxeTagComponent)
  }
})

dynamicApp.component(VxeTagComponent.name as string, VxeTagComponent)

export const Tag = VxeTag
export default VxeTag

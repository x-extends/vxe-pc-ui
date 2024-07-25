import { App } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeTagsComponent from './src/tags'
import { dynamicApp } from '../dynamics'

export const VxeTags = Object.assign({}, VxeTagsComponent, {
  install (app: App) {
    app.component(VxeTagsComponent.name, VxeTagsComponent)
  }
})
dynamicApp.component(VxeTagsComponent.name, VxeTagsComponent)
VxeUI.component(VxeTagsComponent)

export const Tags = VxeTags
export default VxeTags

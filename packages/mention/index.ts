import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import VxeMentionComponent from './src/mention'

export const VxeMention = Object.assign({}, VxeMentionComponent, {
  install (app: VueConstructor) {
    app.component(VxeMentionComponent.name as string, VxeMentionComponent)
  }
})

dynamicApp.use(VxeMention)
VxeUI.component(VxeMentionComponent)

export const Mention = VxeMention
export default VxeMention

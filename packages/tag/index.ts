import { VueConstructor } from 'vue'
import { VxeUI } from '@vxe-ui/core'
import VxeTagComponent from './src/tag'

export const VxeTag = Object.assign({}, VxeTagComponent, {
  install (app: VueConstructor) {
    app.component(VxeTagComponent.name as string, VxeTagComponent)
  }
})

VxeUI.component(VxeTagComponent)

export const Tag = VxeTag
export default VxeTag

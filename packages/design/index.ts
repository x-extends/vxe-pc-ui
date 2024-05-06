import { App } from 'vue'
import VxeDesignComponent from './src/design'

const VxeDesign = Object.assign({}, VxeDesignComponent, {
  install (app: App) {
    app.component(VxeDesignComponent.name as string, VxeDesignComponent)
  }
})

export const Design = VxeDesign
export default VxeDesign

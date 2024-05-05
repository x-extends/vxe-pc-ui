import { App } from 'vue'
import VxeDesignComponent from './design'

const VxeDesign = Object.assign(VxeDesignComponent, {
  install (app: App) {
    app.component(VxeDesignComponent.name, VxeDesignComponent)
  }
})

export default VxeDesign

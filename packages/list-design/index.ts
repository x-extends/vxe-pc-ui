import { App } from 'vue'
import VxeListDesignComponent from './src/list-design'

const VxeListDesign = Object.assign({}, VxeListDesignComponent, {
  install (app: App) {
    app.component(VxeListDesignComponent.name as string, VxeListDesignComponent)
  }
})

export const ListDesign = VxeListDesign
export default VxeListDesign

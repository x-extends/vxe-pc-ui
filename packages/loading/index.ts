import { App } from 'vue'
import VxeLoadingComponent from './src/loading'

const VxeLoading = Object.assign({}, VxeLoadingComponent, {
  install (app: App) {
    app.component(VxeLoadingComponent.name as string, VxeLoadingComponent)
  }
})

export const Loading = VxeLoading
export default VxeLoading

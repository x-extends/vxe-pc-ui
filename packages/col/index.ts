import { App } from 'vue'
import VxeColComponent from '../row/src/col'

const VxeCol = Object.assign({}, VxeColComponent, {
  install (app: App) {
    app.component(VxeColComponent.name as string, VxeColComponent)
  }
})

export const Col = VxeCol
export default VxeCol

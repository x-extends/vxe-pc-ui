import { App } from 'vue'
import { VxeUI, VxeGlobalConfig } from '@vxe-ui/core'

declare const VxeComponents: {
  install(app: App, options?: VxeGlobalConfig): void
}

export {
  VxeUI
}
export default VxeComponents

import { App } from 'vue'
import VxeUI, { VxeGlobalConfig } from '@vxe-ui/core'

import VxeDesign from '@vxe-ui/design'

const VxeComponents = {
  VxeUI,
  Design: VxeDesign,
  install (app: App, options?: VxeGlobalConfig) {
    VxeUI.config(options)

    app.use(VxeDesign)
  }
}

export default VxeComponents

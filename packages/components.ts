import { App } from 'vue'
import VxeUI from './core'
import VxeDesign from './design'

import { VxeGlobalConfig } from '../types'

export function install (app: App, options?: VxeGlobalConfig) {
  VxeUI.config(options)

  app.use(VxeDesign)
}

export * from './core'

// Components
export * from './design'

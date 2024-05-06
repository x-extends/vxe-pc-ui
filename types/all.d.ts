import { App } from 'vue'

import { VxeGlobalConfig } from './core'

export function install (app: App, options?: VxeGlobalConfig): void

export * from './util'
export * from './core'

// Components
export * from './component/design'

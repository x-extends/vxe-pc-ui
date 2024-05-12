import { App } from 'vue'

import { VxeGlobalConfig } from './core'

export function install (app: App, options?: VxeGlobalConfig): void

export * from './util'
export * from './core'

// Components
export * from './component/icon'
export * from './component/layout-container'
export * from './component/layout-header'
export * from './component/layout-aside'
export * from './component/layout-body'
export * from './component/layout-footer'
export * from './component/row'
export * from './component/col'
export * from './component/button'
export * from './component/button-group'
export * from './component/anchor'
export * from './component/anchor-link'
export * from './component/design'

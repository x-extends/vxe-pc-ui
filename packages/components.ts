import { App } from 'vue'
import XEUtils from 'xe-utils'
import { setConfig } from './ui'
import VxeIcon from './icon'
import VxeLayoutContainer from './layout-container'
import VxeLayoutHeader from './layout-header'
import VxeLayoutAside from './layout-aside'
import VxeLayoutBody from './layout-body'
import VxeLayoutFooter from './layout-footer'
import VxeRow from './row'
import VxeCol from './col'
import VxeBreadcrumb from './breadcrumb'
import VxeBreadcrumbItem from './breadcrumb-item'
import VxeButton from './button'
import VxeButtonGroup from './button-group'
import VxeAnchor from './anchor'
import VxeAnchorLink from './anchor-link'
import VxeDesign from './design'

import zhCN from './locale/lang/zh-CN'

import { VxeGlobalConfig } from '../types'

// 默认中文
setConfig({
  i18n: (key: string, args: any) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args)
})

export function install (app: App, options?: VxeGlobalConfig) {
  setConfig(options)

  app.use(VxeIcon)
  app.use(VxeLayoutContainer)
  app.use(VxeLayoutHeader)
  app.use(VxeLayoutAside)
  app.use(VxeLayoutBody)
  app.use(VxeLayoutFooter)
  app.use(VxeRow)
  app.use(VxeCol)
  app.use(VxeBreadcrumb)
  app.use(VxeBreadcrumbItem)
  app.use(VxeButton)
  app.use(VxeButtonGroup)
  app.use(VxeAnchor)
  app.use(VxeAnchorLink)
  app.use(VxeDesign)
}

export * from './ui'

// Components
export * from './icon'
export * from './layout-container'
export * from './layout-header'
export * from './layout-aside'
export * from './layout-body'
export * from './layout-footer'
export * from './row'
export * from './col'
export * from './breadcrumb'
export * from './breadcrumb-item'
export * from './button'
export * from './button-group'
export * from './anchor'
export * from './anchor-link'
export * from './design'

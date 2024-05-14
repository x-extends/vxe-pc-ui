import { App } from 'vue'
import { VxeUIExport, VxeGlobalConfig } from './ui'

import VxeIcon from './component/icon'
import VxeLayoutContainer from './component/layout-container'
import VxeLayoutHeader from './component/layout-header'
import VxeLayoutAside from './component/layout-aside'
import VxeLayoutBody from './component/layout-body'
import VxeLayoutFooter from './component/layout-footer'
import VxeRow from './component/row'
import VxeCol from './component/col'
import VxeBreadcrumb from './component/breadcrumb'
import VxeBreadcrumbItem from './component/breadcrumb-item'
import VxeButton from './component/button'
import VxeButtonGroup from './component/button-group'
import VxeAnchor from './component/anchor'
import VxeAnchorLink from './component/anchor-link'
import VxeLoading from './component/loading'
import VxeTooltip from './component/tooltip'
import VxeForm from './component/form'
import VxeFormItem from './component/form-item'
import VxeFormGather from './component/form-gather'
import VxeFormDesign from './component/form-design'
import VxeListDesign from './component/list-design'
import VxeModal from './component/modal'

export function install (app: App, options?: VxeGlobalConfig): void

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VxeIcon: typeof VxeIcon
    VxeLayoutContainer: typeof VxeLayoutContainer
    VxeLayoutHeader: typeof VxeLayoutHeader
    VxeLayoutAside: typeof VxeLayoutAside
    VxeLayoutBody: typeof VxeLayoutBody
    VxeLayoutFooter: typeof VxeLayoutFooter
    VxeRow: typeof VxeRow
    VxeCol: typeof VxeCol
    VxeBreadcrumb: typeof VxeBreadcrumb
    VxeBreadcrumbItem: typeof VxeBreadcrumbItem
    VxeButton: typeof VxeButton
    VxeButtonGroup: typeof VxeButtonGroup
    VxeAnchor: typeof VxeAnchor
    VxeAnchorLink: typeof VxeAnchorLink
    VxeLoading: typeof VxeLoading
    VxeTooltip: typeof VxeTooltip
    VxeForm: typeof VxeForm
    VxeFormItem: typeof VxeFormItem
    VxeFormGather: typeof VxeFormGather
    VxeFormDesign: typeof VxeFormDesign
    VxeListDesign: typeof VxeListDesign
    VxeModal: typeof VxeModal
  }
}

declare global {
  interface Window {
    VxeUI: VxeUIExport;
  }
}

export * from './tool'
export * from './ui'

// Components
export * from './component/icon'
export * from './component/layout-container'
export * from './component/layout-header'
export * from './component/layout-aside'
export * from './component/layout-body'
export * from './component/layout-footer'
export * from './component/row'
export * from './component/col'
export * from './component/breadcrumb'
export * from './component/breadcrumb-item'
export * from './component/button'
export * from './component/button-group'
export * from './component/anchor'
export * from './component/anchor-link'
export * from './component/loading'
export * from './component/tooltip'
export * from './component/form'
export * from './component/form-item'
export * from './component/form-gather'
export * from './component/form-design'
export * from './component/list-design'
export * from './component/modal'

import { App } from 'vue'
import { VxeUIExport, VxeGlobalConfig } from './ui'

import VxeIcon from './components/icon'
import VxeLayoutContainer from './components/layout-container'
import VxeLayoutHeader from './components/layout-header'
import VxeLayoutAside from './components/layout-aside'
import VxeLayoutBody from './components/layout-body'
import VxeLayoutFooter from './components/layout-footer'
import VxeRow from './components/row'
import VxeCol from './components/col'
import VxeBreadcrumb from './components/breadcrumb'
import VxeBreadcrumbItem from './components/breadcrumb-item'
import VxeButton from './components/button'
import VxeButtonGroup from './components/button-group'
import VxeAnchor from './components/anchor'
import VxeAnchorLink from './components/anchor-link'
import VxeLoading from './components/loading'
import VxeTooltip from './components/tooltip'
import VxeForm from './components/form'
import VxeFormItem from './components/form-item'
import VxeFormGather from './components/form-gather'
import VxeFormDesign from './components/form-design'
import VxeListDesign from './components/list-design'
import VxeModal from './components/modal'

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
export * from './components/anchor'
export * from './components/anchor-link'
export * from './components/breadcrumb'
export * from './components/breadcrumb-item'
export * from './components/button'
export * from './components/button-group'
export * from './components/checkbox'
export * from './components/checkbox-group'
export * from './components/col'
export * from './components/form'
export * from './components/form-design'
export * from './components/form-gather'
export * from './components/form-item'
export * from './components/icon'
export * from './components/input'
export * from './components/layout-aside'
export * from './components/layout-body'
export * from './components/layout-container'
export * from './components/layout-footer'
export * from './components/layout-header'
export * from './components/list-design'
export * from './components/loading'
export * from './components/modal'
export * from './components/optgroup'
export * from './components/option'
export * from './components/pager'
export * from './components/pulldown'
export * from './components/radio'
export * from './components/radio-button'
export * from './components/radio-group'
export * from './components/row'
export * from './components/select'
export * from './components/switch'
export * from './components/textarea'
export * from './components/tooltip'

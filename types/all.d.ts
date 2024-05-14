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

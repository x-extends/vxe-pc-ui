import { App } from 'vue'
import { VxeGlobalConfig } from './ui'

import VxeAnchor from './components/anchor'
import VxeAnchorLink from './components/anchor-link'
import VxeBreadcrumb from './components/breadcrumb'
import VxeBreadcrumbItem from './components/breadcrumb-item'
import VxeButton from './components/button'
import VxeButtonGroup from './components/button-group'
import VxeCalendar from './components/calendar'
import VxeCard from './components/card'
import VxeCheckbox from './components/checkbox'
import VxeCheckboxGroup from './components/checkbox-group'
import VxeCol from './components/col'
import VxeCollapse from './components/collapse'
import VxeCollapsePane from './components/collapse-pane'
import VxeDateInput from './components/date-input'
import VxeDrawer from './components/drawer'
import VxeForm from './components/form'
import VxeFormDesign from './components/form-design'
import VxeFormGather from './components/form-gather'
import VxeFormItem from './components/form-item'
import VxeFormView from './components/form-view'
import VxeIcon from './components/icon'
import VxeInput from './components/input'
import VxeLayoutAside from './components/layout-aside'
import VxeLayoutBody from './components/layout-body'
import VxeLayoutContainer from './components/layout-container'
import VxeLayoutFooter from './components/layout-footer'
import VxeLayoutHeader from './components/layout-header'
import VxeListDesign from './components/list-design'
import VxeListView from './components/list-view'
import VxeList from './components/list'
import VxeLoading from './components/loading'
import VxeMenu from './components/menu'
import VxeModal from './components/modal'
import VxeNumberInput from './components/number-input'
import VxeOptgroup from './components/optgroup'
import VxeOption from './components/option'
import VxePager from './components/pager'
import VxePasswordInput from './components/password-input'
import VxePulldown from './components/pulldown'
import VxeRadio from './components/radio'
import VxeRadioButton from './components/radio-button'
import VxeRadioGroup from './components/radio-group'
import VxeRow from './components/row'
import VxeSelect from './components/select'
import VxeSwitch from './components/switch'
import VxeTabPane from './components/tab-pane'
import VxeTabs from './components/tabs'
import VxeTextarea from './components/textarea'
import VxeTooltip from './components/tooltip'
import VxeTree from './components/tree'
import VxeTreeSelect from './components/tree-select'
import VxeUpload from './components/upload'

export function install (app: App, options?: VxeGlobalConfig): void

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    VxeAnchor: typeof VxeAnchor
    VxeAnchorLink: typeof VxeAnchorLink
    VxeBreadcrumb: typeof VxeBreadcrumb
    VxeBreadcrumbItem: typeof VxeBreadcrumbItem
    VxeButton: typeof VxeButton
    VxeButtonGroup: typeof VxeButtonGroup
    VxeCalendar: typeof VxeCalendar
    VxeCard: typeof VxeCard
    VxeCheckbox: typeof VxeCheckbox
    VxeCheckboxGroup: typeof VxeCheckboxGroup
    VxeCol: typeof VxeCol
    VxeCollapse: typeof VxeCollapse
    VxeCollapsePane: typeof VxeCollapsePane
    VxeDateInput: typeof VxeDateInput
    VxeDrawer: typeof VxeDrawer
    VxeForm: typeof VxeForm
    VxeFormDesign: typeof VxeFormDesign
    VxeFormGather: typeof VxeFormGather
    VxeFormItem: typeof VxeFormItem
    VxeFormView: typeof VxeFormView
    VxeIcon: typeof VxeIcon
    VxeInput: typeof VxeInput
    VxeLayoutAside: typeof VxeLayoutAside
    VxeLayoutBody: typeof VxeLayoutBody
    VxeLayoutContainer: typeof VxeLayoutContainer
    VxeLayoutFooter: typeof VxeLayoutFooter
    VxeLayoutHeader: typeof VxeLayoutHeader
    VxeListDesign: typeof VxeListDesign
    VxeListView: typeof VxeListView
    VxeList: typeof VxeList
    VxeLoading: typeof VxeLoading
    VxeMenu: typeof VxeMenu
    VxeModal: typeof VxeModal
    VxeNumberInput: typeof VxeNumberInput
    VxeOptgroup: typeof VxeOptgroup
    VxeOption: typeof VxeOption
    VxePager: typeof VxePager
    VxePasswordInput: typeof VxePasswordInput
    VxePulldown: typeof VxePulldown
    VxeRadio: typeof VxeRadio
    VxeRadioButton: typeof VxeRadioButton
    VxeRadioGroup: typeof VxeRadioGroup
    VxeRow: typeof VxeRow
    VxeSelect: typeof VxeSelect
    VxeSwitch: typeof VxeSwitch
    VxeTabPane: typeof VxeTabPane
    VxeTabs: typeof VxeTabs
    VxeTextarea: typeof VxeTextarea
    VxeTooltip: typeof VxeTooltip
    VxeTree: typeof VxeTree
    VxeTreeSelect: typeof VxeTreeSelect
    VxeUpload: typeof VxeUpload
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
export * from './components/calendar'
export * from './components/card'
export * from './components/checkbox'
export * from './components/checkbox-group'
export * from './components/col'
export * from './components/collapse'
export * from './components/collapse-pane'
export * from './components/drawer'
export * from './components/date-input'
export * from './components/form'
export * from './components/form-design'
export * from './components/form-gather'
export * from './components/form-item'
export * from './components/form-view'
export * from './components/icon'
export * from './components/input'
export * from './components/layout-aside'
export * from './components/layout-body'
export * from './components/layout-container'
export * from './components/layout-footer'
export * from './components/layout-header'
export * from './components/list-design'
export * from './components/list-view'
export * from './components/list'
export * from './components/loading'
export * from './components/menu'
export * from './components/modal'
export * from './components/number-input'
export * from './components/optgroup'
export * from './components/option'
export * from './components/pager'
export * from './components/password-input'
export * from './components/pulldown'
export * from './components/radio'
export * from './components/radio-button'
export * from './components/radio-group'
export * from './components/row'
export * from './components/select'
export * from './components/switch'
export * from './components/tab-pane'
export * from './components/tabs'
export * from './components/textarea'
export * from './components/tooltip'
export * from './components/tree'
export * from './components/tree-select'
export * from './components/upload'

export * from '@vue/runtime-core'

import { VueConstructor } from 'vue'
import { VxeUIExport, VxeGlobalConfig } from './ui'

import VxeAlert from './components/alert'
import VxeAnchor from './components/anchor'
import VxeAnchorLink from './components/anchor-link'
import VxeAvatar from './components/avatar'
import VxeBadge from './components/badge'
import VxeBreadcrumb from './components/breadcrumb'
import VxeBreadcrumbItem from './components/breadcrumb-item'
import VxeButton from './components/button'
import VxeButtonGroup from './components/button-group'
import VxeCalendar from './components/calendar'
import VxeCard from './components/card'
import VxeCarousel from './components/carousel'
import VxeCarouselItem from './components/carousel-item'
import VxeCheckbox from './components/checkbox'
import VxeCheckboxGroup from './components/checkbox-group'
import VxeCol from './components/col'
import VxeCollapse from './components/collapse'
import VxeCollapsePane from './components/collapse-pane'
import VxeColorPicker from './components/color-picker'
import VxeCountdown from './components/countdown'
import VxeDatePicker from './components/date-picker'
import VxeDrawer from './components/drawer'
import VxeEmpty from './components/empty'
import VxeFlowDesign from './components/flow-design'
import VxeFlowView from './components/flow-view'
import VxeForm from './components/form'
import VxeFormDesign from './components/form-design'
import VxeFormGather from './components/form-gather'
import VxeFormGroup from './components/form-group'
import VxeFormItem from './components/form-item'
import VxeFormView from './components/form-view'
import VxeIcon from './components/icon'
import VxeIconPicker from './components/icon-picker'
import VxeImage from './components/image'
import VxeImageGroup from './components/image-group'
import VxeImagePreview from './components/image-preview'
import VxeInput from './components/input'
import VxeLayoutAside from './components/layout-aside'
import VxeLayoutBody from './components/layout-body'
import VxeLayoutContainer from './components/layout-container'
import VxeLayoutFooter from './components/layout-footer'
import VxeLayoutHeader from './components/layout-header'
import VxeLink from './components/link'
import VxeListDesign from './components/list-design'
import VxeListView from './components/list-view'
import VxeList from './components/list'
import VxeLoading from './components/loading'
import VxeMenu from './components/menu'
import VxeModal from './components/modal'
import VxeNoticeBar from './components/notice-bar'
import VxeNumberInput from './components/number-input'
import VxeOptgroup from './components/optgroup'
import VxeOption from './components/option'
import VxePager from './components/pager'
import VxePasswordInput from './components/password-input'
import VxePrintPageBreak from './components/print-page-break'
import VxePrint from './components/print'
import VxePulldown from './components/pulldown'
import VxeRadio from './components/radio'
import VxeRadioButton from './components/radio-button'
import VxeRadioGroup from './components/radio-group'
import VxeRate from './components/rate'
import VxeResult from './components/result'
import VxeRow from './components/row'
import VxeSelect from './components/select'
import VxeSlider from './components/slider'
import VxeSteps from './components/steps'
import VxeSwitch from './components/switch'
import VxeTabPane from './components/tab-pane'
import VxeTableSelect from './components/table-select'
import VxeTabs from './components/tabs'
import VxeTag from './components/tag'
import VxeTextEllipsis from './components/text-ellipsis'
import VxeText from './components/text'
import VxeTextarea from './components/textarea'
import VxeTip from './components/tip'
import VxeTooltip from './components/tooltip'
import VxeTree from './components/tree'
import VxeTreeSelect from './components/tree-select'
import VxeUpload from './components/upload'
import VxeWatermark from './components/watermark'

// Vxe Table
import VxeColumn from './components/column'
import VxeColgroup from './components/colgroup'
import VxeTable from './components/table'
import VxeGrid from './components/grid'
import VxeToolbar from './components/toolbar'

declare global {
  interface Window {
    VxeUI: VxeUIExport;
  }
}

export function install (app: VueConstructor, options?: VxeGlobalConfig): void

interface AllComponents {
  VxeAlert: typeof VxeAlert
  VxeAnchor: typeof VxeAnchor
  VxeAnchorLink: typeof VxeAnchorLink
  VxeAvatar: typeof VxeAvatar
  VxeBadge: typeof VxeBadge
  VxeBreadcrumb: typeof VxeBreadcrumb
  VxeBreadcrumbItem: typeof VxeBreadcrumbItem
  VxeButton: typeof VxeButton
  VxeButtonGroup: typeof VxeButtonGroup
  VxeCalendar: typeof VxeCalendar
  VxeCard: typeof VxeCard
  VxeCarousel: typeof VxeCarousel
  VxeCarouselItem: typeof VxeCarouselItem
  VxeCheckbox: typeof VxeCheckbox
  VxeCheckboxGroup: typeof VxeCheckboxGroup
  VxeCol: typeof VxeCol
  VxeCollapse: typeof VxeCollapse
  VxeCollapsePane: typeof VxeCollapsePane
  VxeColorPicker: typeof VxeColorPicker
  VxeCountdown: typeof VxeCountdown
  VxeDatePicker: typeof VxeDatePicker
  VxeDrawer: typeof VxeDrawer
  VxeEmpty: typeof VxeEmpty
  VxeFlowDesign: typeof VxeFlowDesign
  VxeFlowView: typeof VxeFlowView
  VxeForm: typeof VxeForm
  VxeFormDesign: typeof VxeFormDesign
  VxeFormGather: typeof VxeFormGather
  VxeFormGroup: typeof VxeFormGroup
  VxeFormItem: typeof VxeFormItem
  VxeFormView: typeof VxeFormView
  VxeIcon: typeof VxeIcon
  VxeIconPicker: typeof VxeIconPicker
  VxeImage: typeof VxeImage
  VxeImageGroup: typeof VxeImageGroup
  VxeImagePreview: typeof VxeImagePreview
  VxeInput: typeof VxeInput
  VxeLayoutAside: typeof VxeLayoutAside
  VxeLayoutBody: typeof VxeLayoutBody
  VxeLayoutContainer: typeof VxeLayoutContainer
  VxeLayoutFooter: typeof VxeLayoutFooter
  VxeLayoutHeader: typeof VxeLayoutHeader
  VxeLink: typeof VxeLink
  VxeListDesign: typeof VxeListDesign
  VxeListView: typeof VxeListView
  VxeList: typeof VxeList
  VxeLoading: typeof VxeLoading
  VxeMenu: typeof VxeMenu
  VxeModal: typeof VxeModal
  VxeNoticeBar: typeof VxeNoticeBar
  VxeNumberInput: typeof VxeNumberInput
  VxeOptgroup: typeof VxeOptgroup
  VxeOption: typeof VxeOption
  VxePager: typeof VxePager
  VxePasswordInput: typeof VxePasswordInput
  VxePrintPageBreak: typeof VxePrintPageBreak
  VxePrint: typeof VxePrint
  VxePulldown: typeof VxePulldown
  VxeRadio: typeof VxeRadio
  VxeRadioButton: typeof VxeRadioButton
  VxeRadioGroup: typeof VxeRadioGroup
  VxeRate: typeof VxeRate
  VxeResult: typeof VxeResult
  VxeRow: typeof VxeRow
  VxeSelect: typeof VxeSelect
  VxeSlider: typeof VxeSlider
  VxeSteps: typeof VxeSteps
  VxeSwitch: typeof VxeSwitch
  VxeTabPane: typeof VxeTabPane
  VxeTableSelect: typeof VxeTableSelect
  VxeTabs: typeof VxeTabs
  VxeTag: typeof VxeTag
  VxeTextEllipsis: typeof VxeTextEllipsis
  VxeText: typeof VxeText
  VxeTextarea: typeof VxeTextarea
  VxeTip: typeof VxeTip
  VxeTooltip: typeof VxeTooltip
  VxeTree: typeof VxeTree
  VxeTreeSelect: typeof VxeTreeSelect
  VxeUpload: typeof VxeUpload
  VxeWatermark: typeof VxeWatermark

  // Vxe Table
  VxeColumn: typeof VxeColumn
  VxeColgroup: typeof VxeColgroup
  VxeTable: typeof VxeTable
  VxeGrid: typeof VxeGrid
  VxeToolbar: typeof VxeToolbar
}

declare module '@vxe-ui/core' {
  export interface VxeGlobalComponents extends AllComponents {}
}

export * from './ui'

// Components
export * from './components/alert'
export * from './components/anchor'
export * from './components/anchor-link'
export * from './components/avatar'
export * from './components/badge'
export * from './components/breadcrumb'
export * from './components/breadcrumb-item'
export * from './components/button'
export * from './components/button-group'
export * from './components/calendar'
export * from './components/card'
export * from './components/carousel'
export * from './components/carousel-item'
export * from './components/checkbox'
export * from './components/checkbox-group'
export * from './components/col'
export * from './components/collapse'
export * from './components/collapse-pane'
export * from './components/color-picker'
export * from './components/countdown'
export * from './components/date-picker'
export * from './components/drawer'
export * from './components/empty'
export * from './components/flow-design'
export * from './components/flow-view'
export * from './components/form'
export * from './components/form-design'
export * from './components/form-gather'
export * from './components/form-group'
export * from './components/form-item'
export * from './components/form-view'
export * from './components/icon'
export * from './components/icon-picker'
export * from './components/image'
export * from './components/image-group'
export * from './components/image-preview'
export * from './components/input'
export * from './components/layout-aside'
export * from './components/layout-body'
export * from './components/layout-container'
export * from './components/layout-footer'
export * from './components/layout-header'
export * from './components/link'
export * from './components/list-design'
export * from './components/list-view'
export * from './components/list'
export * from './components/loading'
export * from './components/menu'
export * from './components/modal'
export * from './components/notice-bar'
export * from './components/number-input'
export * from './components/optgroup'
export * from './components/option'
export * from './components/pager'
export * from './components/password-input'
export * from './components/print-page-break'
export * from './components/print'
export * from './components/pulldown'
export * from './components/radio'
export * from './components/radio-button'
export * from './components/radio-group'
export * from './components/rate'
export * from './components/result'
export * from './components/row'
export * from './components/select'
export * from './components/slider'
export * from './components/steps'
export * from './components/switch'
export * from './components/tab-pane'
export * from './components/table-select'
export * from './components/tabs'
export * from './components/tag'
export * from './components/text-ellipsis'
export * from './components/text'
export * from './components/textarea'
export * from './components/tip'
export * from './components/tooltip'
export * from './components/tree'
export * from './components/tree-select'
export * from './components/upload'
export * from './components/watermark'

// 兼容老版本
// export * from './components/column'
// export * from './components/colgroup'
// export * from './components/table'
// export * from './components/grid'
// export * from './components/toolbar'

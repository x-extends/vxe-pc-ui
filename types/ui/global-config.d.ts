// Vxe UI
import { VxeAlertProps } from '../components/alert'
import { VxeAnchorProps } from '../components/anchor'
import { VxeAnchorLinkProps } from '../components/anchor-link'
import { VxeBreadcrumbProps } from '../components/breadcrumb'
import { VxeBreadcrumbItemProps } from '../components/breadcrumb-item'
import { VxeButtonProps } from '../components/button'
import { VxeButtonGroupProps } from '../components/button-group'
import { VxeCalendarProps } from '../components/calendar'
import { VxeCardProps } from '../components/card'
import { VxeCarouselProps } from '../components/carousel'
import { VxeCheckboxProps } from '../components/checkbox'
import { VxeCheckboxGroupProps } from '../components/checkbox-group'
import { VxeColProps } from '../components/col'
import { VxeCollapseProps } from '../components/collapse'
import { VxeCollapsePaneProps } from '../components/collapse-pane'
import { VxeDatePickerProps } from '../components/date-picker'
import { VxeDrawerProps } from '../components/drawer'
import { VxeFormProps } from '../components/form'
import { VxeFormDesignProps } from '../components/form-design'
import { VxeFormGatherProps } from '../components/form-gather'
import { VxeFormItemProps } from '../components/form-item'
import { VxeFormViewProps } from '../components/form-view'
import { VxeIconProps } from '../components/icon'
import { VxeImageProps } from '../components/image'
import { VxeImageGroupProps } from '../components/image-group'
import { VxeImagePreviewProps } from '../components/image-preview'
import { VxeInputProps } from '../components/input'
import { VxeLayoutAsideProps } from '../components/layout-aside'
import { VxeLayoutBodyProps } from '../components/layout-body'
import { VxeLayoutContainerProps } from '../components/layout-container'
import { VxeLayoutFooterProps } from '../components/layout-footer'
import { VxeLayoutHeaderProps } from '../components/layout-header'
import { VxeLinkProps } from '../components/link'
import { VxeListDesignProps } from '../components/list-design'
import { VxeListViewProps } from '../components/list-view'
import { VxeListProps } from '../components/list'
import { VxeLoadingProps } from '../components/loading'
import { VxeMenuProps } from '../components/menu'
import { VxeModalProps } from '../components/modal'
import { VxeNumberInputProps } from '../components/number-input'
import { VxeOptgroupProps } from '../components/optgroup'
import { VxeOptionProps } from '../components/option'
import { VxePagerProps } from '../components/pager'
import { VxePasswordInputProps } from '../components/password-input'
import { VxePrintProps } from '../components/print'
import { VxePrintPageBreakProps } from '../components/print-page-break'
import { VxePulldownProps } from '../components/pulldown'
import { VxeRadioProps } from '../components/radio'
import { VxeRadioButtonProps } from '../components/radio-button'
import { VxeRadioGroupProps } from '../components/radio-group'
import { VxeRowProps } from '../components/row'
import { VxeSelectProps } from '../components/select'
import { VxeSwitchProps } from '../components/switch'
import { VxeTabPaneProps } from '../components/tab-pane'
import { VxeTabsProps } from '../components/tabs'
import { VxeTagProps } from '../components/tag'
import { VxeTagsProps } from '../components/tags'
import { VxeTextProps } from '../components/text'
import { VxeTextareaProps } from '../components/textarea'
import { VxeTipProps } from '../components/tip'
import { VxeTooltipProps } from '../components/tooltip'
import { VxeTreeProps } from '../components/tree'
import { VxeTreeSelectProps } from '../components/tree-select'
import { VxeUploadProps } from '../components/upload'

// Vxe Table
import { VxeTableProps } from '../components/table'
import { VxeColumnProps } from '../components/column'
import { VxeColgroupProps } from '../components/colgroup'
import { VxeGridProps } from '../components/grid'
import { VxeToolbarProps } from '../components/toolbar'

declare module '@vxe-ui/core' {
  export interface VxeGlobalConfig {
    alert?: VxeAlertProps
    anchor?: VxeAnchorProps
    anchorLink?: VxeAnchorLinkProps
    breadcrumb?: VxeBreadcrumbProps
    breadcrumbItem?: VxeBreadcrumbItemProps
    button?: VxeButtonProps
    buttonGroup?: VxeButtonGroupProps
    calendar?: VxeCalendarProps
    card?: VxeCardProps
    carousel?: VxeCarouselProps
    checkbox?: VxeCheckboxProps
    checkboxGroup?: VxeCheckboxGroupProps
    col?: VxeColProps
    collapse?: VxeCollapseProps
    collapsePane?: VxeCollapsePaneProps
    datePicker?: VxeDatePickerProps
    drawer?: VxeDrawerProps
    form?: VxeFormProps
    formDesign?: VxeFormDesignProps
    formGather?: VxeFormGatherProps
    formItem?: VxeFormItemProps
    formView?: VxeFormViewProps
    icon?: VxeIconProps
    image?: VxeImageProps
    imageGroup?: VxeImageGroupProps
    imagePreview?: VxeImagePreviewProps
    input?: VxeInputProps
    layoutAside?: VxeLayoutAsideProps
    layoutBody?: VxeLayoutBodyProps
    layoutContainer?: VxeLayoutContainerProps
    layoutFooter?: VxeLayoutFooterProps
    layoutHeader?: VxeLayoutHeaderProps
    link?: VxeLinkProps
    listDesign?: VxeListDesignProps
    listView?: VxeListViewProps
    list?: VxeListProps
    loading?: VxeLoadingProps
    menu?: VxeMenuProps
    modal?: VxeModalProps
    numberInput?: VxeNumberInputProps
    optgroup?: VxeOptgroupProps
    option?: VxeOptionProps
    pager?: VxePagerProps
    passwordInput?: VxePasswordInputProps
    print?: VxePrintProps
    printPageBreak?: VxePrintPageBreakProps
    pulldown?: VxePulldownProps
    radio?: VxeRadioProps
    radioButton?: VxeRadioButtonProps
    radioGroup?: VxeRadioGroupProps
    row?: VxeRowProps
    select?: VxeSelectProps
    switch?: VxeSwitchProps
    tabPane?: VxeTabPaneProps
    tabs?: VxeTabsProps
    tag?: VxeTagProps
    tags?: VxeTagsProps
    text?: VxeTextProps
    textarea?: VxeTextareaProps
    tip?: VxeTipProps
    tooltip?: VxeTooltipProps
    tree?: VxeTreeProps
    treeSelect?: VxeTreeSelectProps
    upload?: VxeUploadProps

    table?: VxeTableProps
    column?: VxeColumnProps
    colgroup?: VxeColgroupProps
    grid?: VxeGridProps
    toolbar?: VxeToolbarProps

    /**
     * 无效，已废弃
     * @deprecated
     */
    export?: Record<string, any>
    /**
     * 无效，已废弃
     * @deprecated
     */
    i18n?(key: string, args?: any): string
    /**
     * @deprecated
     */
    emptyCell?: string
    /**
     * 还原成老的校验样式
     * @deprecated
     */
    cellVaildMode?: 'obsolete'
    /**
     * 返回老的校验结果
     * @deprecated
     */
    validToReject?: 'obsolete'
    /**
     * 无效，已废弃
     * @deprecated
     */
    v?: string
  }
}

// Vxe UI
import { VxeAlertProps } from '../components/alert'
import { VxeAnchorProps } from '../components/anchor'
import { VxeAnchorLinkProps } from '../components/anchor-link'
import { VxeAvatarProps } from '../components/avatar'
import { VxeBadgeProps } from '../components/badge'
import { VxeBreadcrumbProps } from '../components/breadcrumb'
import { VxeBreadcrumbItemProps } from '../components/breadcrumb-item'
import { VxeButtonProps } from '../components/button'
import { VxeButtonGroupProps } from '../components/button-group'
import { VxeCalendarProps } from '../components/calendar'
import { VxeCardProps } from '../components/card'
import { VxeCarouselProps } from '../components/carousel'
import { VxeCarouselItemProps } from '../components/carousel-item'
import { VxeCheckboxProps } from '../components/checkbox'
import { VxeCheckboxGroupProps } from '../components/checkbox-group'
import { VxeColProps } from '../components/col'
import { VxeCollapseProps } from '../components/collapse'
import { VxeCollapsePaneProps } from '../components/collapse-pane'
import { VxeCountdownProps } from '../components/countdown'
import { VxeDatePickerProps } from '../components/date-picker'
import { VxeDrawerProps } from '../components/drawer'
import { VxeEmptyProps } from '../components/empty'
import { VxeFormProps } from '../components/form'
import { VxeFormDesignProps } from '../components/form-design'
import { VxeFormGatherProps } from '../components/form-gather'
import { VxeFormGroupProps } from '../components/form-group'
import { VxeFormItemProps } from '../components/form-item'
import { VxeFormViewProps } from '../components/form-view'
import { VxeIconProps } from '../components/icon'
import { VxeIconPickerProps } from '../components/icon-picker'
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
import { VxeNoticeBarProps } from '../components/notice-bar'
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
import { VxeResultProps } from '../components/result'
import { VxeRowProps } from '../components/row'
import { VxeSelectProps } from '../components/select'
import { VxeSliderProps } from '../components/slider'
import { VxeStepsProps } from '../components/steps'
import { VxeSwitchProps } from '../components/switch'
import { VxeTabPaneProps } from '../components/tab-pane'
import { VxeTabsProps } from '../components/tabs'
import { VxeTagProps } from '../components/tag'
import { VxeTextEllipsisProps } from '../components/text-ellipsis'
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
    avatar?: VxeAvatarProps
    badge?: VxeBadgeProps
    breadcrumb?: VxeBreadcrumbProps
    breadcrumbItem?: VxeBreadcrumbItemProps
    button?: VxeButtonProps
    buttonGroup?: VxeButtonGroupProps
    calendar?: VxeCalendarProps
    card?: VxeCardProps
    carousel?: VxeCarouselProps
    carouselItem?: VxeCarouselItemProps
    checkbox?: VxeCheckboxProps
    checkboxGroup?: VxeCheckboxGroupProps
    col?: VxeColProps
    collapse?: VxeCollapseProps
    collapsePane?: VxeCollapsePaneProps
    countdown?: VxeCountdownProps
    datePicker?: VxeDatePickerProps
    drawer?: VxeDrawerProps
    empty?: VxeEmptyProps
    form?: VxeFormProps
    formDesign?: VxeFormDesignProps
    formGather?: VxeFormGatherProps
    formGroup?: VxeFormGroupProps
    formItem?: VxeFormItemProps
    formView?: VxeFormViewProps
    icon?: VxeIconProps
    iconPicker?: VxeIconPickerProps
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
    noticeBar?: VxeNoticeBarProps
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
    result?: VxeResultProps
    row?: VxeRowProps
    select?: VxeSelectProps
    slider?: VxeSliderProps
    steps?: VxeStepsProps
    switch?: VxeSwitchProps
    tabPane?: VxeTabPaneProps
    tabs?: VxeTabsProps
    tag?: VxeTagProps
    textEllipsis?: VxeTextEllipsisProps
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

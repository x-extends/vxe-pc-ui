import { VxeUI, setConfig, setIcon } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'

VxeUI.uiVersion = process.env.VUE_APP_VXE_VERSION as string
VxeUI.tableVersion = ''

VxeUI.dynamicApp = dynamicApp

setConfig({
  anchor: {},
  anchorLink: {},
  breadcrumb: {
    separator: '/'
  },
  breadcrumbItem: {},
  button: {},
  buttonGroup: {},
  checkbox: {},
  checkboxGroup: {},
  col: {},
  colgroup: {},
  collapse: {},
  collapsePane: {},
  column: {},
  drawer: {
    // size: null,
    showHeader: true,
    lockView: true,
    mask: true,
    showTitleOverflow: true,
    showClose: true
  },
  form: {
    // preventSubmit: false,
    // size: null,
    // colon: false,
    validConfig: {
      showMessage: true,
      autoPos: true
    },
    tooltipConfig: {
      enterable: true
    },
    titleAsterisk: true
  },
  formDesign: {
    height: 400,
    showPC: true
  },
  formGather: {},
  formItem: {},
  grid: {},
  icon: {},
  input: {
    // size: null,
    // transfer: false
    // parseFormat: 'yyyy-MM-dd HH:mm:ss.SSS',
    // labelFormat: '',
    // valueFormat: '',
    startDate: new Date(1900, 0, 1),
    endDate: new Date(2100, 0, 1),
    startDay: 1,
    selectDay: 1,
    digits: 2,
    controls: true
  },
  layoutAside: {},
  layoutBody: {},
  layoutContainer: {},
  layoutFooter: {},
  layoutHeader: {},
  link: {
    underline: true
  },
  listDesign: {},
  list: {
    // size: null,
    scrollY: {
      enabled: true,
      gt: 100
      // oSize: 0
    }
  },
  loading: {},
  modal: {
    // size: null,
    top: 15,
    showHeader: true,
    minWidth: 340,
    minHeight: 140,
    lockView: true,
    mask: true,
    duration: 3000,
    marginSize: 0,
    dblclickZoom: true,
    showTitleOverflow: true,
    animat: true,
    showClose: true,
    draggable: true,
    showConfirmButton: null,
    // storage: false,
    storageKey: 'VXE_MODAL_POSITION'
  },
  optgroup: {},
  option: {},
  pager: {
    // size: null,
    // autoHidden: false,
    // perfect: true,
    // pageSize: 10,
    // pagerCount: 7,
    // pageSizes: [10, 15, 20, 50, 100],
    // layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total']
  },
  pulldown: {},
  radio: {
    strict: true
  },
  radioButton: {
    strict: true
  },
  radioGroup: {
    strict: true
  },
  row: {},
  select: {
    multiCharOverflow: 8
  },
  switch: {},
  tabPane: {},
  table: {},
  tabs: {},
  textarea: {},
  toolbar: {},
  tips: {
    title: 'Tip'
  },
  tooltip: {
    // size: null,
    trigger: 'hover',
    theme: 'dark',
    enterDelay: 500,
    leaveDelay: 300
  }
})

const iconPrefix = 'vxe-icon-'

setIcon({
  // loading
  LOADING: iconPrefix + 'spinner roll vxe-loading--default-icon',

  // button
  BUTTON_DROPDOWN: iconPrefix + 'arrow-down',
  BUTTON_LOADING: iconPrefix + 'spinner roll',

  // menu
  MENU_ITEM_EXPAND_OPEN: iconPrefix + 'arrow-down rotate180',
  MENU_ITEM_EXPAND_CLOSE: iconPrefix + 'arrow-down',

  // select
  SELECT_LOADED: iconPrefix + 'spinner roll',
  SELECT_OPEN: iconPrefix + 'caret-down rotate180',
  SELECT_CLOSE: iconPrefix + 'caret-down',

  // pager
  PAGER_HOME: iconPrefix + 'home-page',
  PAGER_END: iconPrefix + 'end-page',
  PAGER_JUMP_PREV: iconPrefix + 'arrow-double-left',
  PAGER_JUMP_NEXT: iconPrefix + 'arrow-double-right',
  PAGER_PREV_PAGE: iconPrefix + 'arrow-left',
  PAGER_NEXT_PAGE: iconPrefix + 'arrow-right',
  PAGER_JUMP_MORE: iconPrefix + 'ellipsis-h',

  // input
  INPUT_CLEAR: iconPrefix + 'error-circle-fill',
  INPUT_PWD: iconPrefix + 'eye-fill',
  INPUT_SHOW_PWD: iconPrefix + 'eye-fill-close',
  INPUT_PREV_NUM: iconPrefix + 'caret-up',
  INPUT_NEXT_NUM: iconPrefix + 'caret-down',
  INPUT_DATE: iconPrefix + 'calendar',
  INPUT_SEARCH: iconPrefix + 'search',

  // modal
  MODAL_ZOOM_IN: iconPrefix + 'square',
  MODAL_ZOOM_OUT: iconPrefix + 'maximize',
  MODAL_CLOSE: iconPrefix + 'close',
  MODAL_INFO: iconPrefix + 'info-circle-fill',
  MODAL_SUCCESS: iconPrefix + 'success-circle-fill',
  MODAL_WARNING: iconPrefix + 'warning-circle-fill',
  MODAL_ERROR: iconPrefix + 'error-circle-fill',
  MODAL_QUESTION: iconPrefix + 'question-circle-fill',
  MODAL_LOADING: iconPrefix + 'spinner roll',

  // form
  FORM_PREFIX: iconPrefix + 'question-circle-fill',
  FORM_SUFFIX: iconPrefix + 'question-circle-fill',
  FORM_FOLDING: iconPrefix + 'arrow-up rotate180',
  FORM_UNFOLDING: iconPrefix + 'arrow-up',

  // design-form
  DESIGN_FORM_WIDGET_ADD: iconPrefix + 'square-plus-fill',
  DESIGN_FORM_WIDGET_COPY: iconPrefix + 'copy',
  DESIGN_FORM_WIDGET_DELETE: iconPrefix + 'delete',
  DESIGN_FORM_WIDGET_OPTION_DELETE: iconPrefix + 'delete',
  DESIGN_FORM_WIDGET_OPTION_EXPAND_OPEN: iconPrefix + 'square-plus',
  DESIGN_FORM_WIDGET_OPTION_EXPAND_CLOSE: iconPrefix + 'square-minus'
})

export * from '@vxe-ui/core'
export default VxeUI

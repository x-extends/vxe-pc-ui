import { VxeUI, setConfig, setIcon, log } from '@vxe-ui/core'
import { dynamicApp } from '../dynamics'
import { getFuncText } from './src/utils'

import { VxeGlobalConfig } from '../../types'

VxeUI.uiVersion = process.env.VUE_APP_VXE_VERSION as string
VxeUI.tableVersion = ''
VxeUI.t = VxeUI.getI18n
VxeUI._t = getFuncText

VxeUI.dynamicApp = dynamicApp

export function config (options?: VxeGlobalConfig) {
  log.warn('vxe.error.delFunc', ['config', 'setConfig'])
  return setConfig(options)
}

export function setup (options?: VxeGlobalConfig) {
  log.warn('vxe.error.delFunc', ['setup', 'setConfig'])
  return setConfig(options)
}

VxeUI.config = config
VxeUI.setup = setup

/**
 * 已废弃
 * @deprecated
 */
export const globalStore = {}
VxeUI.globalStore = globalStore

setConfig({
  alert: {},
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
    position: 'left',
    showHeader: true,
    lockView: true,
    mask: true,
    showTitleOverflow: true,
    showClose: true,
    padding: true
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
    showPc: true
  },
  formGather: {},
  formItem: {},
  formView: {},
  grid: {},
  icon: {},
  image: {},
  imagePreview: {},
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
  listDesign: {
    height: 400,
    showPc: true
  },
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
    padding: true,
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
  passwordInput: {},
  print: {},
  printPageBreak: {},
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
  tips: {},
  tooltip: {
    // size: null,
    trigger: 'hover',
    theme: 'dark',
    enterDelay: 500,
    leaveDelay: 300
  },
  tree: {
    indent: 20,
    radioConfig: {
      strict: true
    }
  },
  treeSelect: {},
  upload: {
    mode: 'all',
    imageTypes: ['jpg', 'jpeg', 'png', 'gif']
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

  // radio
  RADIO_CHECKED: iconPrefix + 'radio-checked-fill',
  RADIO_UNCHECKED: iconPrefix + 'radio-unchecked',

  // checkbox
  CHECKBOX_INDETERMINATE: iconPrefix + 'checkbox-indeterminate-fill',
  CHECKBOX_CHECKED: iconPrefix + 'checkbox-checked-fill',
  CHECKBOX_UNCHECKED: iconPrefix + 'checkbox-unchecked',

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

  // form-design
  FORM_DESIGN_STYLE_SETTING: iconPrefix + 'layout',
  FORM_DESIGN_PROPS_PC: iconPrefix + 'pc',
  FORM_DESIGN_PROPS_MOBILE: iconPrefix + 'mobile',
  FORM_DESIGN_WIDGET_ADD: iconPrefix + 'square-plus-fill',
  FORM_DESIGN_WIDGET_COPY: iconPrefix + 'copy',
  FORM_DESIGN_WIDGET_DELETE: iconPrefix + 'delete',
  FORM_DESIGN_WIDGET_OPTION_DELETE: iconPrefix + 'delete',
  FORM_DESIGN_WIDGET_OPTION_EXPAND_OPEN: iconPrefix + 'square-plus',
  FORM_DESIGN_WIDGET_OPTION_EXPAND_CLOSE: iconPrefix + 'square-minus',

  // list-design
  LIST_DESIGN_FIELD_SETTING: iconPrefix + 'custom-column',
  LIST_DESIGN_LIST_SETTING: iconPrefix + 'menu',

  // upload
  UPLOAD_FILE_ERROR: iconPrefix + 'warning-circle-fill',
  UPLOAD_FILE_ADD: iconPrefix + 'upload',
  UPLOAD_FILE_DELETE: iconPrefix + 'delete',
  UPLOAD_IMAGE_RE_UPLOAD: iconPrefix + 'repeat',
  UPLOAD_IMAGE_ADD: iconPrefix + 'add',
  UPLOAD_IMAGE_DELETE: iconPrefix + 'close',
  UPLOAD_LOADING: iconPrefix + 'spinner roll vxe-loading--default-icon',
  UPLOAD_FILE_TYPE_DEFAULT: iconPrefix + 'file',
  UPLOAD_FILE_TYPE_XLSX: iconPrefix + 'file-excel',
  UPLOAD_FILE_TYPE_XLS: iconPrefix + 'file-excel',
  UPLOAD_FILE_TYPE_PDF: iconPrefix + 'file-pdf',
  UPLOAD_FILE_TYPE_PNG: iconPrefix + 'file-image',
  UPLOAD_FILE_TYPE_GIF: iconPrefix + 'file-image',
  UPLOAD_FILE_TYPE_JPG: iconPrefix + 'file-image',
  UPLOAD_FILE_TYPE_JPEG: iconPrefix + 'file-image',
  UPLOAD_FILE_TYPE_MD: iconPrefix + 'file-markdown',
  UPLOAD_FILE_TYPE_PPD: iconPrefix + 'file-ppt',
  UPLOAD_FILE_TYPE_DOCX: iconPrefix + 'file-word',
  UPLOAD_FILE_TYPE_DOC: iconPrefix + 'file-word',
  UPLOAD_FILE_TYPE_ZIP: iconPrefix + 'file-zip',
  UPLOAD_FILE_TYPE_TXT: iconPrefix + 'file-txt',

  // image-preview
  IMAGE_PREVIEW_CLOSE: iconPrefix + 'close',
  IMAGE_PREVIEW_PREVIOUS: iconPrefix + 'arrow-left',
  IMAGE_PREVIEW_NEXT: iconPrefix + 'arrow-right',
  IMAGE_PREVIEW_PCT_FULL: iconPrefix + 'pct-full',
  IMAGE_PREVIEW_PCT_1_1: iconPrefix + 'pct-1-1',
  IMAGE_PREVIEW_ZOOM_OUT: iconPrefix + 'search-zoom-out',
  IMAGE_PREVIEW_ZOOM_IN: iconPrefix + 'search-zoom-in',
  IMAGE_PREVIEW_ROTATE_LEFT: iconPrefix + 'rotate-left',
  IMAGE_PREVIEW_ROTATE_RIGHT: iconPrefix + 'rotate-right',
  IMAGE_PREVIEW_PRINT: iconPrefix + 'print',

  // alert
  ALERT_CLOSE: iconPrefix + 'close',
  ALERT_INFO: iconPrefix + 'info-circle-fill',
  ALERT_SUCCESS: iconPrefix + 'success-circle-fill',
  ALERT_WARNING: iconPrefix + 'warning-circle-fill',
  ALERT_ERROR: iconPrefix + 'error-circle-fill',

  // tree
  TREE_NODE_OPEN: iconPrefix + 'caret-right rotate90',
  TREE_NODE_CLOSE: iconPrefix + 'caret-right'
})

export * from '@vxe-ui/core'
export default VxeUI

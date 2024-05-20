import { VxeGlobalIcon } from '../../../types'

const iconPrefix = 'vxe-icon-'

const iconConfigStore: VxeGlobalIcon = {
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
}

export default iconConfigStore

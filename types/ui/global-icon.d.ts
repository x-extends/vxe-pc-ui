import '@vxe-ui/core'

declare module '@vxe-ui/core' {
  export interface VxeGlobalIcon {
    // table
    TABLE_SORT_ASC?: string
    TABLE_SORT_DESC?: string
    TABLE_FILTER_NONE?: string
    TABLE_FILTER_MATCH?: string
    TABLE_EDIT?: string
    TABLE_TITLE_PREFIX?: string
    TABLE_TITLE_SUFFIX?: string
    TABLE_TREE_LOADED?: string
    TABLE_TREE_OPEN?: string
    TABLE_TREE_CLOSE?: string
    TABLE_EXPAND_LOADED?: string
    TABLE_EXPAND_OPEN?: string
    TABLE_EXPAND_CLOSE?: string
    TABLE_CHECKBOX_CHECKED?: string
    TABLE_CHECKBOX_UNCHECKED?: string
    TABLE_CHECKBOX_INDETERMINATE?: string
    TABLE_RADIO_CHECKED?: string
    TABLE_RADIO_UNCHECKED?: string

    // toolbar
    TOOLBAR_TOOLS_REFRESH?: string
    TOOLBAR_TOOLS_REFRESH_LOADING?: string
    TOOLBAR_TOOLS_IMPORT?: string
    TOOLBAR_TOOLS_EXPORT?: string
    TOOLBAR_TOOLS_PRINT?: string
    TOOLBAR_TOOLS_FULLSCREEN?: string
    TOOLBAR_TOOLS_MINIMIZE?: string
    TOOLBAR_TOOLS_CUSTOM?: string
    TOOLBAR_TOOLS_FIXED_LEFT?: string
    TOOLBAR_TOOLS_FIXED_LEFT_ACTIVED?: string
    TOOLBAR_TOOLS_FIXED_RIGHT?: string
    TOOLBAR_TOOLS_FIXED_RIGHT_ACTIVED?: string

    // loading
    LOADING?: string

    // button
    BUTTON_DROPDOWN?: string
    BUTTON_LOADING?: string

    // menu
    MENU_ITEM_EXPAND_OPEN?: string
    MENU_ITEM_EXPAND_CLOSE?: string

    // select
    SELECT_LOADED?: string
    SELECT_OPEN?: string
    SELECT_CLOSE?: string

    // pager
    PAGER_HOME?: string
    PAGER_END?: string
    PAGER_JUMP_PREV?: string
    PAGER_JUMP_NEXT?: string
    PAGER_PREV_PAGE?: string
    PAGER_NEXT_PAGE?: string
    PAGER_JUMP_MORE?: string

    // input
    INPUT_CLEAR?: string
    INPUT_PWD?: string
    INPUT_SHOW_PWD?: string
    INPUT_PREV_NUM?: string
    INPUT_NEXT_NUM?: string
    INPUT_DATE?: string
    INPUT_SEARCH?: string

    // modal
    MODAL_ZOOM_IN?: string
    MODAL_ZOOM_OUT?: string
    MODAL_CLOSE?: string
    MODAL_INFO?: string
    MODAL_SUCCESS?: string
    MODAL_WARNING?: string
    MODAL_ERROR?: string
    MODAL_QUESTION?: string
    MODAL_LOADING?: string

    // form
    FORM_PREFIX?: string
    FORM_SUFFIX?: string
    FORM_FOLDING?: string
    FORM_UNFOLDING?: string

    // design-form
    DESIGN_FORM_WIDGET_ADD?: string
    DESIGN_FORM_WIDGET_COPY?: string
    DESIGN_FORM_WIDGET_DELETE?: string
    DESIGN_FORM_WIDGET_OPTION_DELETE?: string
    DESIGN_FORM_WIDGET_OPTION_EXPAND_OPEN?: string
    DESIGN_FORM_WIDGET_OPTION_EXPAND_CLOSE?: string
  }
}

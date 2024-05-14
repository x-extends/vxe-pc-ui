import { VxeGlobalConfig } from '../../../types'

const globalConfigStore: Required<VxeGlobalConfig> = {
  size: '',
  theme: '',
  version: 1,
  zIndex: 999,
  emptyCell: '　',
  loadingText: '',

  i18n: (key: string) => key,

  tooltip: {
    // size: null,
    trigger: 'hover',
    theme: 'dark',
    enterDelay: 500,
    leaveDelay: 300
  },
  pager: {
    // size: null,
    // autoHidden: false,
    // perfect: true,
    // pageSize: 10,
    // pagerCount: 7,
    // pageSizes: [10, 15, 20, 50, 100],
    // layouts: ['PrevJump', 'PrevPage', 'Jump', 'PageCount', 'NextPage', 'NextJump', 'Sizes', 'Total']
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
  textarea: {
    // size: null,
    // autosize: {
    //   minRows: 1,
    //   maxRows: 10
    // }
  },
  select: {
    // size: null,
    // transfer: false,
    // optionConfig: {
    //   keyField: '_X_OPTION_KEY'
    // },
    multiCharOverflow: 8
  },
  button: {
    // size: null,
    // transfer: false
  },
  buttonGroup: {
    // size: null
  },
  radio: {
    // size: null,
    strict: true
  },
  radioButton: {
    // size: null,
    strict: true
  },
  radioGroup: {
    // size: null,
    strict: true
  },
  checkbox: {
    // size: null
  },
  checkboxGroup: {
    // size: null
  },
  switch: {
    // size: null
  },
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
    // storage: false,
    storageKey: 'VXE_MODAL_POSITION'
  },
  list: {
    // size: null,
    scrollY: {
      enabled: true,
      gt: 100
      // oSize: 0
    }
  },
  breadcrumb: {},
  formDesign: {}
}

export default globalConfigStore

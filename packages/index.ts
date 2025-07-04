import * as VxeUIExport from './components'

interface AA {
  bb: {
    cc: 'hh'
    av: string[]
  } | {
    cc: 'ff'
    av: string[]
    jj: string[]
  } | {
    cc: string
    kk: string
  }
}

const v: AA = {
  bb: {
    cc: 'gg',
    kk: ''
  }
}

export * from './components'
export default VxeUIExport

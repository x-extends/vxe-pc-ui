import { VxeListDesignDefines } from '../../../types'

export const getDefaultSettingFormData = (): VxeListDesignDefines.DefaultSettingFormDataObjVO => {
  return {
    listView: {
      enabled: true
    },
    ganttView: {
      enabled: false
    },
    chartView: {
      enabled: false
    },
    autoFoldFilter: true,
    showCheckbox: 'auto',
    showSeq: true,
    showStatistics: true,
    mobileDefaultView: 'list',
    pcDefaultView: 'list',
    actionButtonList: []
  }
}

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
    showCheckbox: 'auto',
    showSeq: true,
    mobileDefaultView: 'list',
    pcDefaultView: 'list',
    activeBtnList: []
  }
}

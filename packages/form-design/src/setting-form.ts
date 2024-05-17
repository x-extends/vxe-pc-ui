import { h, defineComponent, PropType } from 'vue'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeSwitchComponent from '../../switch/src/switch'

import { VxeFormDesignDefines, VxeFormPropTypes, VxeFormProps } from '../../../types'

export const getDefaultSettingFormData = (): VxeFormProps<VxeFormDesignDefines.DefaultSettingFormObjVO> => {
  return {
    vertical: true,
    data: {
      showPC: true,
      showMobile: true
    }
  }
}

export const DefaultSettingFormViewComponent = defineComponent({
  name: 'DefaultSettingFormView',
  props: {
    formConfig: {
      type: Object as PropType<VxeFormProps<VxeFormDesignDefines.DefaultSettingFormObjVO>>,
      default: () => ({})
    },
    formData: {
      type: Object as PropType<VxeFormDesignDefines.DefaultSettingFormObjVO>,
      default: () => ({})
    },
    formItems: {
      type: Array as PropType<VxeFormPropTypes.Items>,
      default: () => []
    }
  },
  emits: [],
  setup (props) {
    return () => {
      const { formData } = props
      return h(VxeFormComponent, {
        data: formData,
        span: 24,
        vertical: true
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: '显示设置'
            }, {
              default () {
                return [
                  h('div', {}, [
                    h('span', {}, '电脑端'),
                    h(VxeSwitchComponent, {
                      modelValue: formData.showPC,
                      openLabel: '显示',
                      closeLabel: '隐藏',
                      'onUpdate:modelValue' (val) {
                        formData.showPC = val
                      }
                    })
                  ]),
                  h('div', {}, [
                    h('span', {}, '手机端'),
                    h(VxeSwitchComponent, {
                      modelValue: formData.showMobile,
                      openLabel: '显示',
                      closeLabel: '隐藏',
                      'onUpdate:modelValue' (val) {
                        formData.showMobile = val
                      }
                    })
                  ])
                ]
              }
            })
          ]
        }
      })
    }
  }
})

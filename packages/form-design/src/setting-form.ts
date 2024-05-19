import { h, defineComponent, PropType } from 'vue'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeSwitchComponent from '../../switch/src/switch'

import { VxeFormDesignDefines, VxeFormDesignPropTypes } from '../../../types'

export const DefaultSettingFormComponent = defineComponent({
  name: 'DefaultSettingFormView',
  props: {
    formConfig: {
      type: Object as PropType<VxeFormDesignPropTypes.FormConfig>,
      default: () => ({})
    },
    formData: {
      type: Object as PropType<VxeFormDesignDefines.DefaultSettingFormDataObjVO>,
      default: () => ({})
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

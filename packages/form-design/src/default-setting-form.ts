import { h, defineComponent, PropType, inject, createCommentVNode } from 'vue'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeSwitchComponent from '../../switch/src/switch'

import type { VxeFormDesignDefines, VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

export const DefaultSettingFormComponent = defineComponent({
  name: 'DefaultSettingForm',
  props: {
    formData: {
      type: Object as PropType<VxeFormDesignDefines.DefaultSettingFormDataObjVO>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    return () => {
      const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

      if (!$xeFormDesign) {
        return () => []
      }

      const { props: formDesignProps } = $xeFormDesign

      const { formData } = props

      return h(VxeFormComponent, {
        data: formData,
        span: 24,
        vertical: true
      }, {
        default () {
          const { showPC, showMobile } = formDesignProps
          return [
            showPC && showMobile
              ? h(VxeFormItemComponent, {
                title: '显示设置'
              }, {
                default () {
                  return [
                    h('div', {
                      class: 'vxe-design-form--widget-form-item-devices'
                    }, [
                      h('div', {
                        class: 'vxe-design-form--widget-form-item-pc'
                      }, [
                        h('span', {}, '电脑端'),
                        h(VxeSwitchComponent, {
                          modelValue: formData.pcVisible,
                          openLabel: '显示',
                          closeLabel: '隐藏',
                          'onUpdate:modelValue' (val) {
                            formData.pcVisible = val
                          }
                        })
                      ]),
                      h('div', {
                        class: 'vxe-design-form--widget-form-item-mobile'
                      }, [
                        h('span', {}, '手机端'),
                        h(VxeSwitchComponent, {
                          modelValue: formData.mobileVisible,
                          openLabel: '显示',
                          closeLabel: '隐藏',
                          'onUpdate:modelValue' (val) {
                            formData.mobileVisible = val
                          }
                        })
                      ])
                    ])
                  ]
                }
              })
              : createCommentVNode()
          ]
        }
      })
    }
  }
})

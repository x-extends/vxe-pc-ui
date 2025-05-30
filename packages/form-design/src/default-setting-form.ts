import { h, defineComponent, PropType, inject, createCommentVNode } from 'vue'
import { getIcon, getI18n } from '../../ui'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeSwitchComponent from '../../switch/src/switch'
import VxeTextComponent from '../../text/src/text'

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
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return () => []
    }

    const { props: formDesignProps } = $xeFormDesign

    return () => {
      const { formData } = props

      return h(VxeFormComponent, {
        data: formData,
        span: 24,
        vertical: true,
        titleBold: true
      }, {
        default () {
          const { showPc, showMobile } = formDesignProps
          return [
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.formName'),
              field: 'title',
              itemRender: { name: 'VxeInput', props: { placeholder: getI18n('vxe.formDesign.defFormTitle') } }
            }),
            showPc && showMobile
              ? h(VxeFormItemComponent, {
                title: getI18n('vxe.formDesign.widgetProp.displaySetting.name')
              }, {
                default () {
                  return [
                    h('div', {
                      class: 'vxe-form-design--widget-form-item-devices'
                    }, [
                      h('div', {
                        class: 'vxe-form-design--widget-form-item-pc'
                      }, [
                        h(VxeTextComponent, {
                          icon: getIcon().FORM_DESIGN_PROPS_PC,
                          content: getI18n('vxe.formDesign.widgetProp.displaySetting.pc')
                        }),
                        h(VxeSwitchComponent, {
                          modelValue: formData.pcVisible,
                          openLabel: getI18n('vxe.formDesign.widgetProp.displaySetting.visible'),
                          closeLabel: getI18n('vxe.formDesign.widgetProp.displaySetting.hidden'),
                          'onUpdate:modelValue' (val) {
                            formData.pcVisible = val
                          }
                        })
                      ]),
                      h('div', {
                        class: 'vxe-form-design--widget-form-item-mobile'
                      }, [
                        h(VxeTextComponent, {
                          icon: getIcon().FORM_DESIGN_PROPS_MOBILE,
                          content: getI18n('vxe.formDesign.widgetProp.displaySetting.mobile')
                        }),
                        h(VxeSwitchComponent, {
                          modelValue: formData.mobileVisible,
                          openLabel: getI18n('vxe.formDesign.widgetProp.displaySetting.visible'),
                          closeLabel: getI18n('vxe.formDesign.widgetProp.displaySetting.hidden'),
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

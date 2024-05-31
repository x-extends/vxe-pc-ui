import { h, defineComponent, inject, createCommentVNode } from 'vue'
import { getIcon, getI18n } from '@vxe-ui/core'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeTextComponent from '../../text/src/text'

import type { VxeListDesignConstructor, VxeListDesignPrivateMethods, VxeTableDefines } from '../../../types'

export const DefaultFieldSettingFormComponent = defineComponent({
  name: 'DefaultFieldSettingForm',
  props: {},
  emits: [],
  setup () {
    const $xeListDesign = inject<(VxeListDesignConstructor & VxeListDesignPrivateMethods) | null>('$xeListDesign', null)

    if (!$xeListDesign) {
      return () => []
    }

    const { reactData: listDesignReactData } = $xeListDesign

    const changeVisible = (item: VxeTableDefines.ColumnOptions) => {
      item.visible = !item.visible
    }

    const renderChildOptions = (item: VxeTableDefines.ColumnOptions) => {
      const { children } = item
      if (children && children.length) {
        return h('div', {
          class: 'vxe-list-design--field-sub-option',
          onClick () {
            changeVisible(item)
          }
        }, children.map(child => {
          const { title, visible: isChecked } = child
          return h('div', {
            class: ['vxe-list-design--field-checkbox-option', {
              'is--checked': isChecked
            }],
            onClick () {
              changeVisible(child)
            }
          }, [
            h('span', {
              class: ['vxe-checkbox--icon', isChecked ? getIcon().CHECKBOX_CHECKED : getIcon().CHECKBOX_UNCHECKED]
            }),
            h('span', {
              class: 'vxe-checkbox--label'
            }, `${title}`)
          ])
        }))
      }
      return createCommentVNode()
    }

    const renderFieldOptions = () => {
      const { listTableColumns } = listDesignReactData
      return listTableColumns.map(item => {
        const { title, visible: isChecked } = item
        return h('div', {
          class: 'vxe-list-design--field-options'
        }, [
          h('div', {
            class: ['vxe-list-design--field-checkbox-option', {
              'is--checked': isChecked
            }],
            onClick () {
              changeVisible(item)
            }
          }, [
            h('span', {
              class: ['vxe-checkbox--icon', isChecked ? getIcon().CHECKBOX_CHECKED : getIcon().CHECKBOX_UNCHECKED]
            }),
            h('span', {
              class: 'vxe-checkbox--label'
            }, `${title}`)
          ]),
          renderChildOptions(item)
        ])
      })
    }

    return () => {
      return h(VxeFormComponent, {
        span: 24,
        vertical: true,
        titleBold: true
      }, {
        default () {
          return [
            // h(VxeFormItemComponent, {
            //   title: '查询条件'
            // }),
            h(VxeFormItemComponent, {
              title: '列表字段'
            }, {
              default () {
                return renderFieldOptions()
              }
            })
          ]
        }
      })
    }
  }
})

export const DefaultListSettingFormComponent = defineComponent({
  name: 'DefaultListSettingForm',
  props: {},
  emits: [],
  setup () {
    const $xeListDesign = inject<(VxeListDesignConstructor & VxeListDesignPrivateMethods) | null>('$xeListDesign', null)

    if (!$xeListDesign) {
      return () => []
    }

    const { props: listDesignProps } = $xeListDesign

    return () => {
      const { showPc, showMobile } = listDesignProps

      return h(VxeFormComponent, {
        span: 24,
        vertical: true,
        titleBold: true
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: '默认视图'
            }, {
              default () {
                return [
                  h('div', {
                    class: 'vxe-form-design--widget-form-item-devices'
                  }, [
                    showPc
                      ? h('div', {
                        class: 'vxe-form-design--widget-form-item-pc'
                      }, [
                        h(VxeTextComponent, {
                          icon: getIcon().FORM_DESIGN_PROPS_PC,
                          content: getI18n('vxe.formDesign.widgetProp.displaySetting.pc')
                        })
                      ])
                      : createCommentVNode(),
                    showMobile
                      ? h('div', {
                        class: 'vxe-form-design--widget-form-item-mobile'
                      }, [
                        h(VxeTextComponent, {
                          icon: getIcon().FORM_DESIGN_PROPS_MOBILE,
                          content: getI18n('vxe.formDesign.widgetProp.displaySetting.mobile')
                        })
                      ])
                      : createCommentVNode()
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

import { defineComponent, h, inject, createCommentVNode, watch, ref } from 'vue'
import { renderer } from '../../ui/src/renderer'
import { getSlotVNs } from '../../ui/src/vn'
import VxeTabsComponent from '../../tabs/src/tabs'
import VxeTabPaneComponent from '../../tabs/src/tab-pane'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'

import { VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

export default defineComponent({
  props: {},
  emits: [],
  setup () {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return
    }

    const { props: formDesignProps, reactData: formDesignReactData } = $xeFormDesign

    const activeTab = ref(1)

    const renderSettingWidgetForm = () => {
      const { activeWidget } = formDesignReactData
      if (activeWidget) {
        return h(VxeFormComponent, {
          key: activeWidget.id,
          items: activeWidget.formConfig.items,
          data: activeWidget.formConfig.data,
          vertical: true
        })
      }
      return createCommentVNode()
    }

    const renderDefaultSettingForm = () => {
      const { formConfig } = formDesignReactData
      if (formConfig) {
        return h(VxeFormComponent, {
          data: formConfig.data,
          vertical: true
        }, {
          default () {
            return [
              h(VxeFormItemComponent, {
                title: '显示设置',
                field: 'sdfg',
                span: 24
              }, {
                default () {
                  return h('div', '345435')
                }
              }),
              h(VxeFormItemComponent, {
                title: '显示设置',
                field: 'sdfg',
                span: 24
              }, {
                default () {
                  return h('div', '345435')
                }
              })
            ]
          }
        })
      }
      return createCommentVNode()
    }

    const renderSettingConfigForm = () => {
      const { formRender } = formDesignProps
      if (formRender) {
        const compConf = renderer.get(formRender.name)
        const renderSettingForm = compConf ? compConf.renderFormDesignSettingForm : null
        if (renderSettingForm) {
          return h('div', {}, getSlotVNs(renderSettingForm({}, {})))
        }
        return createCommentVNode()
      }
      return renderDefaultSettingForm()
    }

    watch(() => formDesignReactData.activeWidget, () => {
      activeTab.value = 1
    })

    return () => {
      return h('div', {
        class: 'vxe-design-form--setting'
      }, [
        h('div', {
          class: 'vxe-design-form--setting-form'
        }, [
          h(VxeTabsComponent, {
            modelValue: activeTab.value,
            'onUpdate:modelValue' (val) {
              activeTab.value = val
            }
          }, {
            default () {
              return [
                h(VxeTabPaneComponent, {
                  title: '控件属性',
                  name: 1
                }, {
                  default () {
                    return renderSettingWidgetForm()
                  }
                }),
                h(VxeTabPaneComponent, {
                  title: '表单属性',
                  name: 2
                }, {
                  default () {
                    return renderSettingConfigForm()
                  }
                })
              ]
            }
          })
        ])
      ])
    }
  }
})

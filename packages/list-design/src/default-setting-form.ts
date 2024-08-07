import { h, defineComponent, ref, inject, createCommentVNode, computed, reactive } from 'vue'
import { VxeUI, getIcon, getI18n, renderer } from '@vxe-ui/core'
import { createListDesignActionButton } from '../render/util'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeTextComponent from '../../text/src/text'
import VxeSelectComponent from '../../select/src/select'
import VxeSwitchComponent from '../../switch/src/switch'
import VxeRadioGroupComponent from '../../radio/src/group'
import VxeButtonComponent from '../../button/src/button'
import XEUtils from 'xe-utils'

import type { VxeListDesignConstructor, VxeListDesignPrivateMethods, VxeTableDefines, VxeSelectPropTypes, VxeListDesignDefines, VxeGlobalRendererHandles } from '../../../types'

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
      listDesignReactData.listTableColumns = listDesignReactData.listTableColumns.slice(0)
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
            h(VxeFormItemComponent, {
              title: '查询条件'
            }, {
              extra () {
                return h(VxeButtonComponent, {
                  mode: 'text',
                  status: 'primary',
                  icon: getIcon().FORM_DESIGN_PROPS_ADD,
                  disabled: true,
                  content: '新增'
                })
              },
              default () {
                return [
                  h('div', {
                    class: 'vxe-list-design--field-configs-empty-data'
                  }, [
                    h('span', {}, '暂无查询条件')
                  ])
                ]
              }
            }),
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

    const { props: listDesignProps, reactData: listDesignReactData } = $xeListDesign

    const systemConfigList: VxeGlobalRendererHandles.CreateListDesignSettingActionButtonConfigResult[] = []
    const customConfigList: VxeGlobalRendererHandles.CreateListDesignSettingActionButtonConfigResult[] = []
    renderer.forEach((item, name) => {
      const { createListDesignSettingActionButtonConfig } = item
      if (createListDesignSettingActionButtonConfig) {
        const params = { name }
        const btnConfig = Object.assign(createListDesignActionButton({ code: name }), createListDesignSettingActionButtonConfig(params))
        if (btnConfig.type === 'custom') {
          customConfigList.push(btnConfig)
        } else {
          systemConfigList.push(btnConfig)
        }
      }
    })

    const renderViewList = ref([
      { label: '列表视图', value: 'list', isExpand: false }
    ])

    const refSeqOpts = ref([
      { label: '显示', value: true },
      { label: '隐藏', value: false }
    ])

    const refCheckboxOpts = ref([
      { label: '默认', value: 'auto' },
      { label: '允许', value: true },
      { label: '不允许', value: false }
    ])

    const disableView = computed(() => {
      const { formData } = listDesignReactData
      return [formData.listView.enabled, formData.ganttView.enabled, formData.chartView.enabled].filter(enabled => enabled).length <= 1
    })

    const openActiveBtnPopup = (activeBtnObj?: VxeListDesignDefines.DefaultSettingFormActionButton) => {
      const { formData } = listDesignReactData
      const { actionCodes } = listDesignProps

      let btnList = formData.actionButtonList
      if (!btnList) {
        btnList = []
      }

      const activeBtnItem = reactive(createListDesignActionButton(activeBtnObj))
      const systemBtnList = systemConfigList.filter(item => {
        if (actionCodes && actionCodes.length) {
          if (!actionCodes.includes(item.code || '')) {
            return false
          }
        }
        return !btnList.some(obj => obj.code === item.code)
      })
      const customBtnList = customConfigList.filter(item => !btnList.some(obj => obj.code === item.code))

      const btOptions: VxeSelectPropTypes.Options = []
      if (systemBtnList.length) {
        if (!activeBtnItem.type) {
          activeBtnItem.type = ''
        }
        btOptions.push(
          { value: '', label: '系统按钮' }
        )
      }
      if (customBtnList.length) {
        if (!activeBtnItem.type) {
          activeBtnItem.type = 'custom'
        }
        btOptions.push(
          { value: 'custom', label: '自定义按钮' }
        )
      }

      const refSystemConfigOptions = computed(() => {
        return systemBtnList.map(item => {
          const nameConfig = item.name
          return {
            label: XEUtils.toValueString(XEUtils.isFunction(nameConfig) ? nameConfig({ name: item.code || '' }) : nameConfig),
            value: item.code
          }
        })
      })
      const refBtnTypeOptions = ref(btOptions)

      VxeUI.modal.open({
        title: '添加按钮',
        width: 600,
        height: 400,
        showFooter: true,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: '保存',
        onConfirm () {
          if (activeBtnItem.type === 'custom') {
            btnList.push(activeBtnItem)
          } else {
            btnList.push(activeBtnItem)
          }
          formData.actionButtonList = [...btnList]
        },
        slots: {
          default () {
            return h(VxeFormComponent, {
              vertical: true,
              titleBold: true
            }, {
              default () {
                return [
                  h(VxeFormItemComponent, {
                    title: '按钮类型',
                    span: 24
                  }, {
                    default () {
                      return h(VxeSelectComponent, {
                        modelValue: activeBtnItem.type,
                        options: refBtnTypeOptions.value,
                        'onUpdate:modelValue' (val) {
                          activeBtnItem.type = val
                        }
                      })
                    }
                  }),
                  h(VxeFormItemComponent, {
                    title: '选择系统按钮',
                    span: 24
                  }, {
                    default () {
                      return h(VxeSelectComponent, {
                        modelValue: activeBtnItem.code,
                        options: refSystemConfigOptions.value,
                        'onUpdate:modelValue' (val) {
                          activeBtnItem.code = val
                        }
                      })
                    }
                  })
                  // h(VxeFormItemComponent, {
                  //   title: '按钮位置',
                  //   span: 24
                  // }, {
                  //   default () {
                  //     return h(VxeSelectComponent, {
                  //       modelValue: activeBtnItem.classify,
                  //       options: refBtnClassifyOptions.value,
                  //       'onUpdate:modelValue' (val) {
                  //         activeBtnItem.classify = val
                  //       }
                  //     })
                  //   }
                  // })
                ]
              }
            })
          }
        }
      })
    }

    const renderDefaultCellActionButton = () => {
      return h(VxeFormItemComponent, {
        title: '功能按钮'
      }, {
        extra () {
          return h(VxeButtonComponent, {
            mode: 'text',
            status: 'primary',
            icon: getIcon().FORM_DESIGN_PROPS_ADD,
            content: '新增',
            onClick () {
              openActiveBtnPopup()
            }
          })
        },
        default () {
          const { formData } = listDesignReactData
          const btnList = formData.actionButtonList

          return btnList && btnList.length
            ? h('div', {
              class: 'vxe-list-design--field-configs-wrapper'
            }, btnList.map(btnItem => {
              let btnIcon = ''
              let btnName = ''
              if (btnItem.type === 'custom') {
                btnIcon = btnItem.icon
                btnName = btnItem.name
              } else {
                const btnConfig = systemConfigList.find(item => item.code === btnItem.code)
                if (btnConfig) {
                  const nameConfig = btnConfig.name
                  btnIcon = btnConfig.icon || ''
                  btnName = XEUtils.toValueString(XEUtils.isFunction(nameConfig) ? nameConfig({ name: btnConfig.code || '' }) : nameConfig)
                }
              }

              return h('div', {
                class: 'vxe-list-design--field-configs-item'
              }, [
                btnIcon
                  ? h('div', {
                    class: 'vxe-list-design--field-configs-item-icon'
                  }, [
                    h('i', {
                      class: btnIcon
                    })
                  ])
                  : createCommentVNode(),
                h('div', {
                  class: 'vxe-list-design--field-configs-item-title'
                }, `${btnName || ''}`),
                h('div', {
                  class: 'vxe-list-design--field-configs-item-btn'
                }, [
                  h(VxeButtonComponent, {
                    icon: getIcon().LIST_DESIGN_LIST_SETTING_ACTIVE_DELETE,
                    mode: 'text',
                    status: 'error',
                    onClick () {
                      formData.actionButtonList = btnList.filter(item => item !== btnItem)
                    }
                  })
                ])
              ])
            }))
            : h('div', {
              class: 'vxe-list-design--field-configs-empty-data'
            }, [
              h('span', {}, '无操作按钮')
            ])
        }
      })
    }

    return () => {
      const { showPc, showMobile } = listDesignProps
      const { formData } = listDesignReactData

      return h(VxeFormComponent, {
        span: 24,
        vertical: true,
        titleBold: true
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: '视图配置'
            }, {
              default () {
                return h('div', {
                  class: 'vxe-form-design--widget-form-item-render-view'
                }, renderViewList.value.map(item => {
                  return h('div', {
                    key: item.value,
                    class: 'vxe-form-design--widget-form-item-render-view-item'
                  }, [
                    h(VxeSwitchComponent, {
                      modelValue: formData.listView.enabled,
                      disabled: disableView.value,
                      'onUpdate:modelValue' (val) {
                        formData.listView.enabled = val
                      }
                    }),
                    h(VxeTextComponent, {
                      content: item.label,
                      icon: 'vxe-icon-table'
                    })
                  ])
                }))
              }
            }),
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
                        class: 'vxe-form-design--widget-form-item-devices-item'
                      }, [
                        h('div', {
                          class: 'vxe-form-design--widget-form-item-devices-left'
                        }, [
                          h(VxeTextComponent, {
                            icon: getIcon().FORM_DESIGN_PROPS_PC,
                            content: getI18n('vxe.formDesign.widgetProp.displaySetting.pc')
                          })
                        ]),
                        h(VxeSelectComponent, {
                          modelValue: formData.pcDefaultView,
                          className: 'vxe-form-design--widget-form-item-devices-select',
                          options: renderViewList.value,
                          'onUpdate:modelValue' (val) {
                            formData.pcDefaultView = val
                          }
                        })
                      ])
                      : createCommentVNode(),
                    showMobile
                      ? h('div', {
                        class: 'vxe-form-design--widget-form-item-devices-item'
                      }, [
                        h('div', {
                          class: 'vxe-form-design--widget-form-item-devices-left'
                        }, [
                          h(VxeTextComponent, {
                            icon: getIcon().FORM_DESIGN_PROPS_MOBILE,
                            content: getI18n('vxe.formDesign.widgetProp.displaySetting.mobile')
                          })
                        ]),
                        h(VxeSelectComponent, {
                          modelValue: formData.mobileDefaultView,
                          className: 'vxe-form-design--widget-form-item-devices-select',
                          options: renderViewList.value,
                          'onUpdate:modelValue' (val) {
                            formData.mobileDefaultView = val
                          }
                        })
                      ])
                      : createCommentVNode()
                  ])
                ]
              }
            }),
            h(VxeFormItemComponent, {
              title: '列配置'
            }, {
              default () {
                const { formData } = listDesignReactData
                return [
                  h('div', {
                    class: 'vxe-list-design--widget-form-item-prop-list'
                  }, [
                    h('span', {}, '显示序号'),
                    h(VxeRadioGroupComponent, {
                      modelValue: formData.showSeq,
                      options: refSeqOpts.value,
                      'onUpdate:modelValue' (val) {
                        formData.showSeq = val
                      }
                    })
                  ]),
                  h('div', {
                    class: 'vxe-list-design--widget-form-item-prop-list'
                  }, [
                    h('span', {}, '表尾汇总'),
                    h(VxeRadioGroupComponent, {
                      modelValue: formData.showSummary,
                      options: refSeqOpts.value,
                      'onUpdate:modelValue' (val) {
                        formData.showSummary = val
                      }
                    })
                  ])
                ]
              }
            }),
            h(VxeFormItemComponent, {
              title: '批量操作'
            }, {
              default () {
                const { formData } = listDesignReactData
                return h(VxeRadioGroupComponent, {
                  modelValue: formData.showCheckbox,
                  options: refCheckboxOpts.value,
                  'onUpdate:modelValue' (val) {
                    formData.showCheckbox = val
                  }
                })
              }
            }),
            systemConfigList.length || customConfigList.length ? renderDefaultCellActionButton() : createCommentVNode()
          ]
        }
      })
    }
  }
})

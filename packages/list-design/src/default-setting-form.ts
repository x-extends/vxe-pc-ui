import { h, defineComponent, ref, inject, createCommentVNode, computed } from 'vue'
import { getIcon, getI18n } from '@vxe-ui/core'
import VxeFormComponent from '../../form/src/form'
// import VxeFormGatherComponent from '../../form/src/form-gather'
import VxeFormItemComponent from '../../form/src/form-item'
// import VxeTabsComponent from '../../tabs/src/tabs'
// import VxeTabPaneComponent from '../../tabs/src/tab-pane'
import VxeTextComponent from '../../text/src/text'
import VxeSelectComponent from '../../select/src/select'
import VxeSwitchComponent from '../../switch/src/switch'
import VxeRadioGroupComponent from '../../radio/src/group'
// import VxeButtonComponent from '../../button/src/button'

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
            // h(VxeFormItemComponent, {
            //   title: '查询条件'
            // }, {
            //   extra () {
            //     return h(VxeButtonComponent, {
            //       mode: 'text',
            //       status: 'primary',
            //       icon: getIcon().FORM_DESIGN_PROPS_ADD,
            //       disabled: true,
            //       content: '新增'
            //     })
            //   },
            //   default () {
            //     return [
            //       h('div', {
            //         class: 'vxe-list-design--widget-form-empty-data'
            //       }, [
            //         h('span', {}, '暂无查询条件')
            //       ])
            //     ]
            //   }
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

// const renderDefaultCellActiveButton = () => {
//   return h(VxeFormItemComponent, {
//     title: '功能按钮'
//   }, {
//     extra () {
//       return h(VxeButtonComponent, {
//         mode: 'text',
//         status: 'primary',
//         icon: getIcon().FORM_DESIGN_PROPS_ADD,
//         disabled: true,
//         content: '新增'
//       })
//     },
//     default () {
//       return h('div', {
//         class: 'vxe-list-design--widget-form-empty-data'
//       }, [
//         h('span', {}, '无操作按钮')
//       ])
//     }
//   })
// }

// const renderDefaultPcButtonConfigs = () => {
//   return [
//     renderDefaultCellActiveButton(),
//     h(VxeFormItemComponent, {
//       title: '工具栏左侧按钮'
//     }, {
//       extra () {
//         return h(VxeButtonComponent, {
//           mode: 'text',
//           status: 'primary',
//           icon: getIcon().FORM_DESIGN_PROPS_ADD,
//           disabled: true,
//           content: '新增'
//         })
//       },
//       default () {
//         return h('div', {
//           class: 'vxe-list-design--widget-form-empty-data'
//         }, [
//           h('span', {}, '无操作按钮')
//         ])
//       }
//     }),
//     h(VxeFormItemComponent, {
//       title: '工具栏右侧按钮'
//     }, {
//       extra () {
//         return h(VxeButtonComponent, {
//           mode: 'text',
//           status: 'primary',
//           icon: getIcon().FORM_DESIGN_PROPS_ADD,
//           disabled: true,
//           content: '新增'
//         })
//       },
//       default () {
//         return h('div', {
//           class: 'vxe-list-design--widget-form-empty-data'
//         }, [
//           h('span', {}, '无操作按钮')
//         ])
//       }
//     })
//   ]
// }

// const renderDefaultPcButtonTabPane = () => {
//   return h(VxeTabPaneComponent, {
//     name: 'pc',
//     icon: getIcon().FORM_DESIGN_PROPS_PC,
//     title: '电脑端'
//   }, {
//     default () {
//       return [
//         h(VxeFormComponent, {
//           span: 24,
//           vertical: true,
//           titleBold: true
//         }, {
//           default () {
//             return renderDefaultPcButtonConfigs()
//           }
//         })
//       ]
//     }
//   })
// }

// const renderDefaultMobileButtonConfigs = () => {
//   return [
//     renderDefaultCellActiveButton()
//   ]
// }

// const renderDefaultMobileButtonTabPane = () => {
//   return h(VxeTabPaneComponent, {
//     name: 'mobile',
//     icon: getIcon().FORM_DESIGN_PROPS_MOBILE,
//     title: '移动端'
//   }, {
//     default () {
//       return [
//         h(VxeFormComponent, {
//           span: 24,
//           vertical: true,
//           titleBold: true
//         }, {
//           default () {
//             return renderDefaultMobileButtonConfigs()
//           }
//         })
//       ]
//     }
//   })
// }

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

    // const activeBtnTab = ref('pc')

    const renderViewList = ref([
      { label: '列表视图', value: 'list', isExpand: false }
    ])

    const refSeqOpts = ref([
      { label: '显示', value: true },
      { label: '隐藏', value: false }
    ])

    const refCheckboxOpts = ref([
      { label: '默认', value: 'auto' },
      { label: '是', value: true },
      { label: '否', value: false }
    ])

    const disableView = computed(() => {
      const { formData } = listDesignReactData
      return [formData.listView.enabled, formData.ganttView.enabled, formData.chartView.enabled].filter(enabled => enabled).length <= 1
    })

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
                    h('span', {}, '批量操作'),
                    h(VxeRadioGroupComponent, {
                      modelValue: formData.showCheckbox,
                      options: refCheckboxOpts.value,
                      'onUpdate:modelValue' (val) {
                        formData.showCheckbox = val
                      }
                    })
                  ])
                ]
              }
            })
            // showPc && showMobile
            //   ? h(VxeFormItemComponent, {
            //     title: '按钮配置'
            //   }, {
            //     default () {
            //       return h(VxeTabsComponent, {
            //         modelValue: activeBtnTab.value,
            //         'onUpdate:modelValue' (val) {
            //           activeBtnTab.value = val
            //         }
            //       }, {
            //         default () {
            //           return [
            //             renderDefaultPcButtonTabPane(),
            //             renderDefaultMobileButtonTabPane()
            //           ]
            //         }
            //       })
            //     }
            //   })
            //   : h(VxeFormGatherComponent, {
            //     span: 24
            //   }, {
            //     default () {
            //       return showMobile ? renderDefaultMobileButtonConfigs() : renderDefaultPcButtonConfigs()
            //     }
            //   })
          ]
        }
      })
    }
  }
})

import { PropType, VNode, defineComponent, h, onMounted, ref, watch } from 'vue'
import iconConfigStore from '../../ui/src/iconStore'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeButtonComponent from '../../button/src/button'
import VxeTextareaComponent from '../../textarea/src/textarea'
import { modal } from '../../modal'
import { WidgetSelectFormObjVO, WidgetSelectFormOptionObjVO, WidgetSelectFormOptionSubObjVO } from './select-data'
import { useKebabCaseName } from '../render/hooks'

import { VxeFormDesignDefines } from '../../../types'

export const WidgetSelectFormComponent = defineComponent({
  props: {
    widget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetSelectFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const computeKebabCaseName = useKebabCaseName(props)

    const optionsContent = ref('')
    const expandIndexs = ref<number[]>([])

    const addOptionEvent = () => {
      const { widget } = props
      const { widgetFormData } = widget
      const options = widgetFormData.options || []
      options.push({
        value: `选项${options.length + 1}`
      })
      widgetFormData.options = [...options]
    }

    const subRE = /^(\s|\t)+/

    const hasSubOption = (str: string) => {
      return subRE.test(str)
    }

    const expandAllOption = () => {
      const { widget } = props
      const { widgetFormData } = widget
      const options = widgetFormData.options || []
      const indexs: number[] = []
      options.forEach((group, gIndex) => {
        const { options } = group
        if (options && options.length) {
          indexs.push(gIndex)
        }
      })
      expandIndexs.value = indexs
    }

    const toggleExpandOption = (item: WidgetSelectFormOptionSubObjVO, gIndex: number) => {
      if (expandIndexs.value.includes(gIndex)) {
        expandIndexs.value = expandIndexs.value.filter(num => num !== gIndex)
      } else {
        expandIndexs.value.push(gIndex)
      }
    }

    const confirmBatchAddOptionEvent = () => {
      const { widget } = props
      const { widgetFormData } = widget
      const options: WidgetSelectFormOptionSubObjVO[] = []
      const rowList = optionsContent.value.split('\n')
      let prevGroup: Required<WidgetSelectFormOptionObjVO> | null = null
      rowList.forEach((str, index) => {
        const nextStr = rowList[index + 1]
        const value = str.trim()
        if (!value) {
          return
        }
        const item: WidgetSelectFormOptionSubObjVO = {
          value
        }
        if (prevGroup) {
          if (hasSubOption(str)) {
            prevGroup.options.push(item)
            return
          }
          prevGroup = null
          options.push(item)
        } else {
          options.push(item)
        }
        if (nextStr) {
          if (hasSubOption(nextStr)) {
            prevGroup = Object.assign(item, { options: [] })
          }
        }
      })
      widgetFormData.options = options
      expandAllOption()
    }

    const openPopupEditEvent = () => {
      const { widget } = props
      const { widgetFormData } = widget
      const kebabCaseName = computeKebabCaseName.value

      const contList: string[] = []
      widgetFormData.options?.forEach(group => {
        contList.push(group.value)
        group.options?.forEach(item => {
          contList.push(`\t${item.value}`)
        })
      })

      optionsContent.value = contList.join('\n')

      modal.open({
        title: `${widgetFormData.itemTitle} - 批量编辑选项`,
        width: 500,
        height: '50vh ',
        resize: true,
        showFooter: true,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: '生成选项',
        onConfirm: confirmBatchAddOptionEvent,
        slots: {
          default () {
            return h('div', {
              class: `vxe-design-form--widget-${kebabCaseName}-form-options-popup`
            }, [
              h('div', {
                class: `vxe-design-form--widget-${kebabCaseName}-form-options-popup-title`
              }, '每行对应一个选项，如果是分组，子项可以是空格或制表键开头'),
              h(VxeTextareaComponent, {
                resize: 'none',
                modelValue: optionsContent.value,
                'onUpdate:modelValue' (val) {
                  optionsContent.value = val
                }
              })
            ])
          }
        }
      })
    }

    const renderOption = (item: WidgetSelectFormOptionSubObjVO, hasFirstLevel: boolean, isExpand: boolean, gIndex: number, hasSub: boolean, isFirst: boolean, isLast: boolean) => {
      const kebabCaseName = computeKebabCaseName.value
      return h('div', {
        class: [`vxe-design-form--widget-${kebabCaseName}-form-options-option`, {
          'is--first': isFirst,
          'is--last': isLast
        }]
      }, [
        h('div', {
          class: 'vxe-design-form--widget-expand-btn'
        }, hasFirstLevel && hasSub
          ? [
              h('i', {
                class: isExpand ? iconConfigStore.DESIGN_FORM_WIDGET_OPTION_EXPAND_CLOSE : iconConfigStore.DESIGN_FORM_WIDGET_OPTION_EXPAND_OPEN,
                onClick () {
                  toggleExpandOption(item, gIndex)
                }
              })
            ]
          : []),
        h('input', {
          class: 'vxe-default-input',
          value: item.value,
          onInput (evnt: InputEvent & { target: HTMLInputElement }) {
            item.value = evnt.target.value
          }
        }),
        h(VxeButtonComponent, {
          status: 'danger',
          mode: 'text',
          icon: iconConfigStore.DESIGN_FORM_WIDGET_DELETE
        })
      ])
    }

    const renderOptions = () => {
      const { widget } = props
      const { widgetFormData } = widget
      const groups = widgetFormData.options
      const kebabCaseName = computeKebabCaseName.value
      const optVNs: VNode[] = []
      if (groups) {
        groups.forEach((group, gIndex) => {
          const { options } = group
          const isExpand = expandIndexs.value.includes(gIndex)
          if (options && options.length) {
            optVNs.push(renderOption(group, true, isExpand, gIndex, true, gIndex === 0, gIndex === groups.length - 1))
            if (isExpand) {
              optVNs.push(
                h('div', {
                  class: `vxe-design-form--widget-${kebabCaseName}-form-options-subs`
                }, options.map(item => renderOption(item, false, isExpand, 0, false, false, false)))
              )
            }
          } else {
            optVNs.push(renderOption(group, true, isExpand, gIndex, false, gIndex === 0, gIndex === groups.length - 1))
          }
        })
      }
      return optVNs
    }

    watch(() => props.widget, () => {
      expandAllOption()
    })

    onMounted(() => {
      expandAllOption()
    })

    return () => {
      const { widget } = props
      const { widgetFormData } = widget
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormComponent, {
        class: `vxe-design-form--widget-${kebabCaseName}-form`,
        vertical: true,
        span: 24,
        data: widgetFormData
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: '控件名称',
              field: 'itemTitle',
              itemRender: { name: 'VxeInput' }
            }),
            h(VxeFormItemComponent, {
              title: '数据源',
              field: 'options'
            }, {
              default () {
                return [
                  h('div', {}, [
                    h(VxeButtonComponent, {
                      status: 'primary',
                      mode: 'text',
                      content: '添加选项',
                      onClick: addOptionEvent
                    }),
                    h(VxeButtonComponent, {
                      status: 'primary',
                      mode: 'text',
                      content: '批量编辑',
                      onClick: openPopupEditEvent
                    })
                  ]),
                  h('div', {
                    class: `vxe-design-form--widget-${kebabCaseName}-form-options`
                  }, renderOptions())
                ]
              }
            })
          ]
        }
      })
    }
  }
})

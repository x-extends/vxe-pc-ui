import { PropType, VNode, defineComponent, h, onMounted, ref, watch } from 'vue'
import { VxeUI, getIcon, getI18n } from '@vxe-ui/core'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeButtonComponent from '../../button/src/button'
import VxeInputComponent from '../../input/src/input'
import VxeTextareaComponent from '../../textarea/src/textarea'
import VxeSwitchComponent from '../../switch/src/switch'
import VxeTipsComponent from '../../tips/src/tips'
import { WidgetSelectFormObjVO, WidgetSelectFormOptionObjVO, WidgetSelectFormOptionSubObjVO } from './select-data'
import { useKebabCaseName } from '../render/hooks'

import type { VxeGlobalRendererHandles } from '../../../types'

export const WidgetSelectFormComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams<WidgetSelectFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const computeKebabCaseName = useKebabCaseName(props)

    const optionsContent = ref('')
    const expandIndexList = ref<number[]>([])

    const addOptionEvent = () => {
      const { renderParams } = props
      const { widget } = renderParams
      const options = widget.options.options || []
      options.push({
        value: getI18n('vxe.formDesign.widgetProp.dataSource.defValue', [options.length + 1])
      })
      widget.options.options = [...options]
    }

    const subRE = /^(\s|\t)+/

    const hasSubOption = (str: string) => {
      return subRE.test(str)
    }

    const expandAllOption = () => {
      const { renderParams } = props
      const { widget } = renderParams
      const options = widget.options.options || []
      const indexList: number[] = []
      options.forEach((group, gIndex) => {
        const { options } = group
        if (options && options.length) {
          indexList.push(gIndex)
        }
      })
      expandIndexList.value = indexList
    }

    const toggleExpandOption = (item: WidgetSelectFormOptionSubObjVO, gIndex: number) => {
      if (expandIndexList.value.includes(gIndex)) {
        expandIndexList.value = expandIndexList.value.filter(num => num !== gIndex)
      } else {
        expandIndexList.value.push(gIndex)
      }
    }

    const confirmBatchAddOptionEvent = () => {
      const { renderParams } = props
      const { widget } = renderParams
      const optList: WidgetSelectFormOptionSubObjVO[] = []
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
          optList.push(item)
        } else {
          optList.push(item)
        }
        if (nextStr) {
          if (hasSubOption(nextStr)) {
            prevGroup = Object.assign(item, { options: [] })
          }
        }
      })
      widget.options.options = optList
      expandAllOption()
    }

    const openPopupEditEvent = () => {
      const { renderParams } = props
      const { widget } = renderParams
      const kebabCaseName = computeKebabCaseName.value

      const contList: string[] = []
      widget.options.options?.forEach(group => {
        contList.push(group.value)
        group.options?.forEach(item => {
          contList.push(`\t${item.value}`)
        })
      })

      optionsContent.value = contList.join('\n')

      VxeUI.modal.open({
        title: `${widget.title} - ${getI18n('vxe.formDesign.widgetProp.dataSource.batchEditOption')}`,
        width: 500,
        height: '50vh ',
        resize: true,
        showFooter: true,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: getI18n('vxe.formDesign.widgetProp.dataSource.buildOption'),
        onConfirm: confirmBatchAddOptionEvent,
        slots: {
          default () {
            return h('div', {
              class: `vxe-form-design--widget-${kebabCaseName}-form-options-popup`
            }, [
              h(VxeTipsComponent, {
                status: 'primary',
                title: '',
                content: '每行对应一个选项，如果是分组，子项可以是空格或制表键开头，可从 Excel 或 WPS 中复制。'
              }),
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
        class: [`vxe-form-design--widget-${kebabCaseName}-form-options-option`, {
          'is--first': isFirst,
          'is--last': isLast
        }]
      }, [
        h('div', {
          class: 'vxe-form-design--widget-expand-btn'
        }, hasFirstLevel && hasSub
          ? [
              h('i', {
                class: isExpand ? getIcon().DESIGN_FORM_WIDGET_OPTION_EXPAND_CLOSE : getIcon().DESIGN_FORM_WIDGET_OPTION_EXPAND_OPEN,
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
          icon: getIcon().DESIGN_FORM_WIDGET_DELETE
        })
      ])
    }

    const renderOptions = () => {
      const { renderParams } = props
      const { widget } = renderParams
      const { options } = widget
      const groups = options.options
      const kebabCaseName = computeKebabCaseName.value
      const optVNs: VNode[] = []
      if (groups) {
        groups.forEach((group, gIndex) => {
          const { options } = group
          const isExpand = expandIndexList.value.includes(gIndex)
          if (options && options.length) {
            optVNs.push(renderOption(group, true, isExpand, gIndex, true, gIndex === 0, gIndex === groups.length - 1))
            if (isExpand) {
              optVNs.push(
                h('div', {
                  class: `vxe-form-design--widget-${kebabCaseName}-form-options-subs`
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

    watch(() => props.renderParams.widget, () => {
      expandAllOption()
    })

    onMounted(() => {
      expandAllOption()
    })

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormComponent, {
        class: `vxe-form-design--widget-${kebabCaseName}-form`,
        vertical: true,
        span: 24,
        titleBold: true,
        data: widget.options
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.name')
            }, {
              default () {
                return h(VxeInputComponent, {
                  modelValue: widget.title,
                  'onUpdate:modelValue' (val) {
                    widget.title = val
                  }
                })
              }
            }),
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.required')
            }, {
              default () {
                return h(VxeSwitchComponent, {
                  modelValue: widget.required,
                  'onUpdate:modelValue' (val) {
                    widget.required = val
                  }
                })
              }
            }),
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.dataSource.name'),
              field: 'options'
            }, {
              default () {
                return [
                  h('div', {}, [
                    h(VxeButtonComponent, {
                      status: 'primary',
                      mode: 'text',
                      content: getI18n('vxe.formDesign.widgetProp.dataSource.addOption'),
                      onClick: addOptionEvent
                    }),
                    h(VxeButtonComponent, {
                      status: 'primary',
                      mode: 'text',
                      content: getI18n('vxe.formDesign.widgetProp.dataSource.batchEditOption'),
                      onClick: openPopupEditEvent
                    })
                  ]),
                  h('div', {
                    class: `vxe-form-design--widget-${kebabCaseName}-form-options`
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

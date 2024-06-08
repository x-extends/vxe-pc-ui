import { VNode, createCommentVNode, h, onMounted, ref, watch } from 'vue'
import { VxeUI, getIcon, getI18n } from '@vxe-ui/core'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeButtonComponent from '../../button/src/button'
import VxeTextareaComponent from '../../textarea/src/textarea'
import VxeTipComponent from '../../tip/src/tip'

import type { VxeGlobalRendererHandles } from '../../../types'

export interface WidgetDataSourceOptionSubObjVO {
  value: string,
}

export interface WidgetDataSourceOptionObjVO {
  value: string,
  options?: WidgetDataSourceOptionSubObjVO[]
}

export function useWidgetPropDataSource (props: {
  readonly renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions;
  readonly renderParams: VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams<{
    options: WidgetDataSourceOptionObjVO[]
  }>;
}, isSubOption: boolean) {
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

  const toggleExpandOption = (item: WidgetDataSourceOptionSubObjVO, gIndex: number) => {
    if (expandIndexList.value.includes(gIndex)) {
      expandIndexList.value = expandIndexList.value.filter(num => num !== gIndex)
    } else {
      expandIndexList.value.push(gIndex)
    }
  }

  const confirmBatchAddOptionEvent = () => {
    const { renderParams } = props
    const { widget } = renderParams
    const optList: WidgetDataSourceOptionSubObjVO[] = []
    const rowList = optionsContent.value.split('\n')
    let prevGroup: Required<WidgetDataSourceOptionObjVO> | null = null
    if (isSubOption) {
      rowList.forEach((str, index) => {
        const nextStr = rowList[index + 1]
        const value = str.trim()
        if (!value) {
          return
        }
        const item: WidgetDataSourceOptionSubObjVO = {
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
    } else {
      rowList.forEach((str) => {
        optList.push({
          value: str.trim()
        })
      })
    }
    widget.options.options = optList
    expandAllOption()
  }

  const openPopupEditEvent = () => {
    const { renderParams } = props
    const { widget } = renderParams

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
            class: 'vxe-form-design--widget-form-item-data-source-popup'
          }, [
            isSubOption
              ? h(VxeTipComponent, {
                status: 'primary',
                title: '',
                content: '每行对应一个选项，如果是分组，子项可以是空格或制表键开头，可从 Excel 或 WPS 中复制。'
              })
              : createCommentVNode(),
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

  const renderOption = (item: WidgetDataSourceOptionSubObjVO, hasFirstLevel: boolean, isExpand: boolean, gIndex: number, hasSub: boolean, isFirst: boolean, isLast: boolean) => {
    return h('div', {
      class: ['vxe-form-design--widget-form-item-data-source-option', {
        'is--first': isFirst,
        'is--last': isLast
      }]
    }, [
      h('div', {
        class: 'vxe-form-design--widget-expand-btn'
      }, hasFirstLevel && hasSub
        ? [
            h('i', {
              class: isExpand ? getIcon().FORM_DESIGN_WIDGET_OPTION_EXPAND_CLOSE : getIcon().FORM_DESIGN_WIDGET_OPTION_EXPAND_OPEN,
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
        icon: getIcon().FORM_DESIGN_WIDGET_DELETE
      })
    ])
  }

  const renderOptions = () => {
    const { renderParams } = props
    const { widget } = renderParams
    const { options } = widget
    const groups = options.options
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
                class: 'vxe-form-design--widget-form-item-data-source-sub-option'
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

  return {
    renderDataSourceFormItem () {
      return h(VxeFormItemComponent, {
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
              class: 'vxe-form-design--widget-form-item-data-source'
            }, renderOptions())
          ]
        }
      })
    }
  }
}

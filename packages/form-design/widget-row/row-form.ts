import { PropType, defineComponent, h, ref, computed, inject } from 'vue'
import { getI18n } from '@vxe-ui/core'
import { useWidgetName } from '../../form-design/src/use'
import { WidgetRowFormObjVO } from './row-data'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeRowComponent from '../../row/src/row'
import VxeColComponent from '../../row/src/col'
import XEUtils from 'xe-utils'

import type { VxeGlobalRendererHandles, VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

export const WidgetRowFormComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetFormViewParams<WidgetRowFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return () => []
    }

    const { computeKebabCaseName } = useWidgetName(props)

    const spanOptions = ref([
      {
        label: getI18n('vxe.formDesign.widgetProp.rowProp.col2'),
        value: 2,
        list: [
          { value: '12,12', spans: [12, 12] },
          { value: '8,16', spans: [8, 16] },
          { value: '16,8', spans: [16, 8] },
          { value: '6,18', spans: [6, 18] },
          { value: '18,6', spans: [18, 6] }
        ]
      },
      {
        label: getI18n('vxe.formDesign.widgetProp.rowProp.col3'),
        value: 3,
        list: [
          { value: '8,8,8', spans: [8, 8, 8] },
          { value: '6,6,12', spans: [6, 6, 12] },
          { value: '12,6,6', spans: [12, 6, 6] },
          { value: '6,12,6', spans: [6, 12, 6] }
        ]
      },
      {
        label: getI18n('vxe.formDesign.widgetProp.rowProp.col4'),
        value: 4,
        list: [
          { value: '6,6,6,6', spans: [6, 6, 6, 6] }
        ]
      },
      {
        label: getI18n('vxe.formDesign.widgetProp.rowProp.col6'),
        value: 6,
        list: [
          { value: '4,4,4,4,4,4', spans: [4, 4, 4, 4, 4, 4] }
        ]
      }
    ])

    const labelMaps: Record<number, string> = {
      18: '3/4',
      16: '2/3',
      12: '1/2',
      8: '1/3',
      6: '1/4',
      4: '1/6'
    }

    const computeSelectSpanItem = computed(() => {
      const { renderParams } = props
      const { widget } = renderParams
      const { options } = widget
      return spanOptions.value.find(item => item.value === options.colSize)
    })

    const changeColSpan = (item: {
      value: string
      spans: number[]
    }) => {
      const { renderParams } = props
      const { widget } = renderParams
      const { options } = widget
      const { reactData: formDesignReactData } = $xeFormDesign
      const { widgetObjList } = formDesignReactData
      const oldChildList = widget.children.filter(item => item.name)
      const overList = oldChildList.slice(options.colSize)
      if (overList.length) {
        const rest = XEUtils.findTree(widgetObjList, obj => obj.id === widget.id, { children: 'children' })
        if (rest) {
          const { items, index } = rest
          if (index >= items.length - 1) {
            items.push(...overList)
          } else {
            items.splice(index + 1, 0, ...overList)
          }
        }
      }
      options.colSpan = item.value
      widget.children = XEUtils.range(0, options.colSize).map((num, index) => {
        return oldChildList[index] || $xeFormDesign.createEmptyWidget()
      })
    }
    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormComponent, {
        class: `vxe-form-design--widget-${kebabCaseName}-form`,
        vertical: true,
        span: 24,
        titleBold: true,
        titleOverflow: true,
        data: widget.options
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.rowProp.colSize'),
              field: 'colSize',
              itemRender: { name: 'VxeRadioGroup', options: spanOptions.value, props: { type: 'button' } }
            }),
            h(VxeFormItemComponent, {
              title: getI18n('vxe.formDesign.widgetProp.rowProp.layout')
            }, {
              default () {
                const selectSpanItem = computeSelectSpanItem.value
                if (selectSpanItem) {
                  return selectSpanItem.list.map((item, rIndex) => {
                    return h(VxeRowComponent, {
                      key: rIndex,
                      class: [`vxe-form-design--widget-${kebabCaseName}-form-row`, {
                        'is--active': item.value === widget.options.colSpan
                      }],
                      onClick () {
                        changeColSpan(item)
                      }
                    }, {
                      default () {
                        return item.spans.map((span, sIndex) => {
                          return h(VxeColComponent, {
                            key: `${rIndex}${sIndex}`,
                            class: `vxe-form-design--widget-${kebabCaseName}-form-col`,
                            span
                          }, {
                            default () {
                              return h('div', {}, `${labelMaps[span]}`)
                            }
                          })
                        })
                      }
                    })
                  })
                }
                return []
              }
            })
          ]
        }
      })
    }
  }
})

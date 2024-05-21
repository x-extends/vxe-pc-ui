import { PropType, defineComponent, h, ref, computed, inject } from 'vue'
import { useKebabCaseName } from '../render/hooks'
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

    const computeKebabCaseName = useKebabCaseName(props)

    const spanOptions = ref([
      {
        label: '两列',
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
        label: '三列',
        value: 3,
        list: [
          { value: '8,8,8', spans: [8, 8, 8] },
          { value: '6,6,12', spans: [6, 6, 12] },
          { value: '12,6,6', spans: [12, 6, 6] },
          { value: '6,12,6', spans: [6, 12, 6] }
        ]
      },
      {
        label: '四列',
        value: 4,
        list: [
          { value: '6,6,6,6', spans: [6, 6, 6, 6] }
        ]
      },
      {
        label: '六列',
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
      options.colSpan = item.value
      widget.children = XEUtils.range(0, options.colSize).map(() => {
        return $xeFormDesign.createEmptyWidget()
      })
    }
    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormComponent, {
        class: `vxe-design-form--widget-${kebabCaseName}-form`,
        vertical: true,
        span: 24,
        data: widget.options
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: '列数',
              field: 'colSize',
              itemRender: { name: 'VxeRadioGroup', options: spanOptions.value, props: { type: 'button' } }
            }),
            h(VxeFormItemComponent, {
              title: '布局'
            }, {
              default () {
                const selectSpanItem = computeSelectSpanItem.value
                if (selectSpanItem) {
                  return selectSpanItem.list.map(item => {
                    return h(VxeRowComponent, {
                      class: [`vxe-design-form--widget-${kebabCaseName}-form-row`, {
                        'is--active': item.value === widget.options.colSpan
                      }],
                      onClick () {
                        changeColSpan(item)
                      }
                    }, {
                      default () {
                        return item.spans.map(span => {
                          return h(VxeColComponent, {
                            class: `vxe-design-form--widget-${kebabCaseName}-form-col`,
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

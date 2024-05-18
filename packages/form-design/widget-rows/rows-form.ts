import { PropType, defineComponent, h, ref, resolveComponent, computed, inject } from 'vue'
import { useKebabCaseName } from '../render/hooks'
import { WidgetRowsFormObjVO } from './rows-data'
import XEUtils from 'xe-utils'

import { VxeFormDesignDefines, VxeFormComponent, VxeFormItemComponent, VxeRowComponent, VxeColComponent, VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

export const WidgetRowsFormComponent = defineComponent({
  props: {
    widget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetRowsFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return
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
      const { widget } = props
      const { widgetFormData } = widget
      return spanOptions.value.find(item => item.value === widgetFormData.colSize)
    })

    const changeColSpan = (item: {
      value: string
      spans: number[]
    }) => {
      const { widget } = props
      const { widgetFormData } = widget
      widgetFormData.colSpan = item.value
      widget.children = XEUtils.range(0, widgetFormData.colSize).map(() => {
        return $xeFormDesign.createEmptyWidget()
      })
    }
    return () => {
      const { widget } = props
      const { widgetFormData } = widget
      const kebabCaseName = computeKebabCaseName.value

      return h(resolveComponent('vxe-form') as VxeFormComponent<WidgetRowsFormObjVO>, {
        class: `vxe-design-form--widget-${kebabCaseName}-form`,
        vertical: true,
        span: 24,
        data: widgetFormData
      }, {
        default () {
          return [
            h(resolveComponent('vxe-form-item') as VxeFormItemComponent, {
              title: '列数',
              field: 'colSize',
              itemRender: { name: 'VxeRadioGroup', options: spanOptions.value, props: { type: 'button' } }
            }),
            h(resolveComponent('vxe-form-item') as VxeFormItemComponent, {
              title: '布局'
            }, {
              default () {
                const selectSpanItem = computeSelectSpanItem.value
                if (selectSpanItem) {
                  return selectSpanItem.list.map(item => {
                    return h(resolveComponent('vxe-row') as VxeRowComponent, {
                      class: ['vxe-design-form--widget-rows-form-row', {
                        'is--active': item.value === widgetFormData.colSpan
                      }],
                      onClick () {
                        changeColSpan(item)
                      }
                    }, {
                      default () {
                        return item.spans.map(span => {
                          return h(resolveComponent('vxe-col') as VxeColComponent, {
                            class: 'vxe-design-form--widget-rows-form-col',
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

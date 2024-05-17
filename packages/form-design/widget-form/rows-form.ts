import { PropType, computed, defineComponent, h, ref } from 'vue'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeRowComponent from '../../row/src/row'
import VxeColComponent from '../../row/src/col'
import { getFormDesignWidgetName } from './util'

import { VxeGlobalRendererHandles, VxeFormDesignDefines, VxeFormProps } from '../../../types'

interface WidgetRowsFormObjVO {
  itemTitle: string
  colSize: number
  colSpan: string
  widgets: any
}

export const getWidgetRowsFormData = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetFormConfigParams): VxeFormProps<WidgetRowsFormObjVO> => {
  return {
    data: {
      itemTitle: getFormDesignWidgetName(params.name),
      colSize: 2,
      colSpan: '12,12',
      widgets: new Array(2).fill(null)
    }
  }
}

export const WidgetRowsFormComponent = defineComponent({
  props: {
    widget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetRowsFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const spanOptions = ref([
      {
        label: '两列',
        value: 2,
        children: [
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
        children: [
          { value: '8,8,8', spans: [8, 8, 8] },
          { value: '6,6,12', spans: [6, 6, 12] },
          { value: '12,6,6', spans: [12, 6, 6] },
          { value: '6,12,6', spans: [6, 12, 6] }
        ]
      },
      {
        label: '四列',
        value: 4,
        children: [
          { value: '6,6,6,6', spans: [6, 6, 6, 6] }
        ]
      },
      {
        label: '六列',
        value: 6,
        children: [
          { value: '4,4,4,4,4,4', spans: [4, 4, 4, 4, 4, 4] }
        ]
      }
    ])

    const labelMaps: Record<number, string> = {
      18: '3/4',
      16: '2/3',
      12: '1/2',
      8: '1/3',
      6: '1/4'
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
      widgetFormData.widgets = new Array(widgetFormData.colSize).fill(null)
    }

    return () => {
      const { widget } = props
      const { widgetFormData } = widget
      return h(VxeFormComponent, {
        class: 'vxe-design-form--widget-input-form',
        vertical: true,
        span: 24,
        data: widgetFormData
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
                  return selectSpanItem.children.map(item => {
                    return h(VxeRowComponent, {
                      class: ['vxe-design-form--widget-input-form-layout-row', {
                        'is--active': item.value === widgetFormData.colSpan
                      }],
                      onClick () {
                        changeColSpan(item)
                      }
                    }, {
                      default () {
                        return item.spans.map(span => {
                          return h(VxeColComponent, {
                            class: 'vxe-design-form--widget-input-form-layout-col',
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

import { h, defineComponent, computed, inject, PropType } from 'vue'
import VxeRowComponent from '../../row/src/row'
import ViewColItemComponent from './view-col-item'

import { VxeFormDesignDefines, VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'WidgetLayoutRows',
  props: {
    colSize: [String, Number],
    colSpan: String,
    widgets: Array as PropType<VxeFormDesignDefines.WidgetObjItem[]>
  },
  emits: [],
  setup (props) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return
    }

    const computedColObjList = computed(() => {
      const { colSpan, widgets } = props
      const colList = colSpan ? `${colSpan}`.split(',') : []
      const rest: VxeFormDesignDefines.ViewColObjItem[] = colList.map((span, index) => {
        return {
          span: Number(span),
          widget: widgets ? widgets[index] : null
        }
      })
      return rest
    })

    return () => {
      return h(VxeRowComponent, {}, {
        default () {
          const colObjList = computedColObjList.value
          return colObjList.map((item, itemIndex) => {
            return h(ViewColItemComponent, {
              key: itemIndex,
              item,
              itemIndex,
              items: colObjList
            })
          })
        }
      })
    }
  }
})

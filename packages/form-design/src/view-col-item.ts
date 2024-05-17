import { h, defineComponent, PropType, inject, provide } from 'vue'
import { renderer } from '../../ui/src/renderer'
import XEUtils from 'xe-utils'
import VxeColComponent from '../../row/src/col'
import { getSlotVNs } from '../../ui/src/vn'
import { hasLayoutGroup } from './util'

import { VxeFormDesignDefines, VxeGlobalRendererHandles, VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

export default defineComponent({
  name: 'ViewColItem',
  props: {
    item: {
      type: Object as PropType<VxeFormDesignDefines.ViewColObjItem>,
      default: () => ({})
    },
    itemIndex: {
      type: Number,
      default: 0
    },
    items: {
      type: Array as PropType<VxeFormDesignDefines.ViewColObjItem[]>,
      default: () => []
    }
  },
  emits: [],
  setup (props) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return
    }

    const { reactData: formDesignReactData } = $xeFormDesign
    const formDesignViewColItem: VxeFormDesignDefines.FormDesignViewColItemInfo = {
      itemIndex: props.itemIndex,
      item: props.item,
      items: props.items
    }

    provide('xeFormDesignViewColItem', formDesignViewColItem)

    const formDesignViewItem = inject<VxeFormDesignDefines.FormDesignViewItemInfo | null>('xeFormDesignViewItem', null)

    const handleDragoverColItem = (evnt: DragEvent, item: VxeFormDesignDefines.ViewColObjItem) => {
      const { widgetObjList, sortWidget } = formDesignReactData
      evnt.stopPropagation()
      if (sortWidget && formDesignViewItem && !item.widget && !hasLayoutGroup(sortWidget.name)) {
        const index = XEUtils.findIndexOf(widgetObjList, item => item.id === sortWidget.id)
        if (index > -1) {
          formDesignViewItem.item.widgetFormData.widgets[props.itemIndex] = sortWidget
          widgetObjList.splice(index, 1)
        }
      }
    }

    return () => {
      const { item } = props
      return h(VxeColComponent, {
        span: item.span
      }, {
        default () {
          const { dragWidget, activeWidget, sortWidget } = formDesignReactData
          const { name } = item.widget || {}
          const compConf = renderer.get(name) || {}
          const renderWidgetView = compConf.renderFormDesignWidgetView
          const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = item.widget
          const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { item: item.widget }
          const isActive = activeWidget && item.widget && activeWidget.id === item.widget.id

          return h('div', {
            class: ['vxe-design-form--preview-widget-view-col-item', XEUtils.kebabCase(name), {
              'is--active': isActive,
              'is--sort': sortWidget && item.widget && sortWidget.id === item.widget.id,
              'is--drag': dragWidget && item.widget && dragWidget.id === item.widget.id
            }],
            onDragover (evnt: DragEvent) {
              handleDragoverColItem(evnt, item)
            },
            onClick (evnt: KeyboardEvent) {
              if (item.widget) {
                evnt.stopPropagation()
                $xeFormDesign.handleClickWidget(evnt, item.widget)
              }
            }
          }, [
            renderWidgetView
              ? getSlotVNs(renderWidgetView(renderOpts, params))
              : h('div', {
                class: 'vxe-design-form--preview-widget-view-layout-empty'
              }, '从左侧将控件拖拽进来')
          ])
        }
      })
    }
  }
})

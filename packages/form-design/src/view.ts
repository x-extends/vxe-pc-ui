import { defineComponent, h, inject, TransitionGroup } from 'vue'
import { renderer } from '../../ui/src/renderer'
import { getSlotVNs } from '../../ui/src/vn'

import { VxeFormDesignConstructor, VxeFormDesignPrivateMethods, VxeGlobalRendererHandles } from '../../../types'
import XEUtils from 'xe-utils'

export default defineComponent({
  props: {},
  emits: [],
  setup () {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return
    }

    const { reactData } = $xeFormDesign

    const dragoverEvent = (evnt: DragEvent) => {
      const { widgetObjList, dragWidget } = reactData
      if (dragWidget) {
        evnt.preventDefault()
        const rest = XEUtils.findTree(widgetObjList, item => item.id === dragWidget.id, { children: 'children' })
        if (!rest) {
          reactData.sortWidget = dragWidget
          widgetObjList.push(dragWidget)
        }
      }
    }

    const sortDragstartEvent = (evnt: DragEvent) => {
      const { widgetObjList } = reactData
      const divEl = evnt.currentTarget as HTMLDivElement
      const widgetId = Number(divEl.getAttribute('data-widget-id'))
      const currRest = XEUtils.findTree(widgetObjList, item => item.id === widgetId, { children: 'children' })
      if (currRest) {
        reactData.dragWidget = null
        reactData.sortWidget = currRest.item
      }
    }

    const sortDragendEvent = () => {
      reactData.activeWidget = reactData.sortWidget
      reactData.sortWidget = null
    }

    let isDragAnimate = false

    const sortDragenterEvent = (evnt: DragEvent) => {
      const { widgetObjList, sortWidget } = reactData
      if (isDragAnimate) {
        evnt.preventDefault()
        return
      }
      if (sortWidget) {
        const divEl = evnt.currentTarget as HTMLDivElement
        evnt.preventDefault()
        const widgetId = Number(divEl.getAttribute('data-widget-id'))
        if (widgetId !== sortWidget.id) {
          const targetRest = XEUtils.findTree(widgetObjList, item => item.id === widgetId, { children: 'children' })
          if (targetRest) {
            const currRest = XEUtils.findTree(widgetObjList, item => item.id === sortWidget.id, { children: 'children' })
            if (currRest) {
              // 控件换位置
              currRest.items.splice(currRest.index, 1)
              targetRest.items.splice(targetRest.index, 0, currRest.item)
              isDragAnimate = true
              setTimeout(() => {
                isDragAnimate = false
              }, 150)
            }
          }
        }
      }
    }

    const dragoverItemEvent = (evnt: DragEvent) => {
      const { sortWidget, dragWidget } = reactData
      if (sortWidget || dragWidget) {
        evnt.preventDefault()
      }
    }

    return () => {
      const { widgetObjList } = reactData
      return h('div', {
        class: 'vxe-design-form--preview',
        onDragover: dragoverEvent
      }, [
        h(TransitionGroup, {
          class: 'vxe-design-form--preview-list',
          tag: 'div',
          name: 'vxe-design-form--preview-list'
        }, {
          default: () => {
            const { dragWidget, activeWidget, sortWidget } = reactData
            return widgetObjList.map(item => {
              const { name } = item
              const compConf = renderer.get(name) || {}
              const renderWidgetView = compConf.renderFormDesignWidgetView
              const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = item
              const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { item }
              return h('div', {
                key: item.id,
                'data-widget-id': item.id,
                draggable: true,
                class: ['vxe-design-form--preview-item', {
                  'is--active': activeWidget && activeWidget.id === item.id,
                  'is--sort': sortWidget && sortWidget.id === item.id,
                  'is--drag': dragWidget && dragWidget.id === item.id
                }],
                onDragstart: sortDragstartEvent,
                onDragend: sortDragendEvent,
                onDragenter: sortDragenterEvent,
                onDragover: dragoverItemEvent,
                onClick (evnt: KeyboardEvent) {
                  $xeFormDesign.handleClickWidget(evnt, item)
                }
              }, [
                h('div', {}, renderWidgetView ? getSlotVNs(renderWidgetView(renderOpts, params)) : [])
              ])
            })
          }
        })
      ])
    }
  }
})

import { createCommentVNode, defineComponent, h, inject, TransitionGroup } from 'vue'
import iconConfigStore from '../../ui/src/iconStore'
import { renderer } from '../../ui/src/renderer'
import { getSlotVNs } from '../../ui/src/vn'
import VxeButtonComponent from '../../button/src/button'

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

    const { reactData: formDesignReactData } = $xeFormDesign

    const dragoverEvent = (evnt: DragEvent) => {
      const { widgetObjList, dragWidget } = formDesignReactData
      if (dragWidget) {
        evnt.preventDefault()
        const rest = XEUtils.findTree(widgetObjList, item => item.id === dragWidget.id, { children: 'children' })
        if (!rest) {
          formDesignReactData.sortWidget = dragWidget
          widgetObjList.push(dragWidget)
        }
      }
    }

    const sortDragstartEvent = (evnt: DragEvent) => {
      const { widgetObjList } = formDesignReactData
      const divEl = evnt.currentTarget as HTMLDivElement
      const widgetId = Number(divEl.getAttribute('data-widget-id'))
      const currRest = XEUtils.findTree(widgetObjList, item => item.id === widgetId, { children: 'children' })
      if (currRest) {
        formDesignReactData.dragWidget = null
        formDesignReactData.sortWidget = currRest.item
      }
    }

    const sortDragendEvent = () => {
      formDesignReactData.activeWidget = formDesignReactData.sortWidget
      formDesignReactData.sortWidget = null
    }

    let isDragAnimate = false

    const sortDragenterEvent = (evnt: DragEvent) => {
      const { widgetObjList, sortWidget } = formDesignReactData
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
      const { sortWidget, dragWidget } = formDesignReactData
      if (sortWidget || dragWidget) {
        evnt.preventDefault()
      }
    }

    return () => {
      const { widgetObjList } = formDesignReactData
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
            const { dragWidget, activeWidget, sortWidget } = formDesignReactData
            return widgetObjList.map(item => {
              const { name } = item
              const compConf = renderer.get(name) || {}
              const renderWidgetView = compConf.renderFormDesignWidgetView
              const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = item
              const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { item }
              const isActive = activeWidget && activeWidget.id === item.id
              return h('div', {
                key: item.id,
                'data-widget-id': item.id,
                draggable: true,
                class: ['vxe-design-form--preview-item', {
                  'is--active': isActive,
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
                h('div', {
                  class: 'vxe-design-form--preview-item-view'
                }, renderWidgetView ? getSlotVNs(renderWidgetView(renderOpts, params)) : []),
                isActive
                  ? h('div', {
                    class: 'vxe-design-form--preview-item-operate'
                  }, [
                    h(VxeButtonComponent, {
                      icon: iconConfigStore.DESIGN_FORM_WIDGET_COPY,
                      status: 'primary',
                      size: 'mini',
                      circle: true,
                      onClick (params) {
                        $xeFormDesign.handleCopyWidget(params.$event, item)
                      }
                    }),
                    h(VxeButtonComponent, {
                      icon: iconConfigStore.DESIGN_FORM_WIDGET_DELETE,
                      status: 'danger',
                      size: 'mini',
                      circle: true,
                      onClick (params) {
                        $xeFormDesign.handleRemoveWidget(params.$event, item)
                      }
                    })
                  ])
                  : createCommentVNode()
              ])
            })
          }
        })
      ])
    }
  }
})

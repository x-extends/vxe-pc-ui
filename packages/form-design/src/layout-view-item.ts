import { h, defineComponent, PropType, inject, createCommentVNode } from 'vue'
import XEUtils from 'xe-utils'
import { getIcon } from '@vxe-ui/core'
import VxeButtonComponent from '../../button/src/button'

import type { VxeFormDesignDefines, VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

export const ViewItemComponent = defineComponent({
  name: 'FormDesignLayoutViewItem',
  props: {
    item: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem>,
      default: () => ({})
    },
    itemIndex: {
      type: Number,
      default: 0
    },
    items: {
      type: Array as PropType<VxeFormDesignDefines.WidgetObjItem[]>,
      default: () => []
    }
  },
  emits: [],
  setup (props, { slots }) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return () => []
    }

    const { reactData: formDesignReactData } = $xeFormDesign

    const sortDragstartEvent = (evnt: DragEvent) => {
      const { widgetObjList, sortSubWidget } = formDesignReactData
      if (sortSubWidget) {
        evnt.preventDefault()
        return
      }
      const divEl = evnt.currentTarget as HTMLDivElement
      const widgetId = Number(divEl.getAttribute('data-widget-id'))
      const currRest = XEUtils.findTree(widgetObjList, item => item && item.id === widgetId, { children: 'children' })
      if (currRest) {
        formDesignReactData.dragWidget = null
        formDesignReactData.sortWidget = currRest.item
        formDesignReactData.sortSubWidget = null
      }
    }

    const sortDragendEvent = () => {
      formDesignReactData.activeWidget = formDesignReactData.sortWidget
      formDesignReactData.sortWidget = null
    }

    let isDragAnimate = false

    const sortDragenterEvent = (evnt: DragEvent) => {
      const { widgetObjList, sortWidget, sortSubWidget } = formDesignReactData
      if (isDragAnimate || sortSubWidget) {
        evnt.preventDefault()
        return
      }
      if (sortWidget) {
        const divEl = evnt.currentTarget as HTMLDivElement
        evnt.preventDefault()
        const widgetId = Number(divEl.getAttribute('data-widget-id'))
        if (widgetId !== sortWidget.id) {
          const targetRest = XEUtils.findTree(widgetObjList, item => item && item.id === widgetId, { children: 'children' })
          if (targetRest) {
            const currRest = XEUtils.findTree(widgetObjList, item => item && item.id === sortWidget.id, { children: 'children' })
            if (currRest) {
              // 控件换位置
              currRest.items.splice(currRest.index, 1)
              targetRest.items.splice(targetRest.index, 0, currRest.item)
              $xeFormDesign.dispatchEvent('drag-widget', { widget: currRest.item }, evnt)
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
      const { sortWidget, dragWidget, sortSubWidget } = formDesignReactData
      if (sortWidget || dragWidget || sortSubWidget) {
        evnt.preventDefault()
      }
    }

    const handleClickEvent = (evnt: KeyboardEvent, item: VxeFormDesignDefines.WidgetObjItem) => {
      $xeFormDesign.handleClickWidget(evnt, item)
      formDesignReactData.sortSubWidget = null
    }

    return () => {
      const { dragWidget, activeWidget, sortWidget } = formDesignReactData
      const { item } = props
      const { name } = item
      const isActive = activeWidget && activeWidget.id === item.id
      const defaultSlot = slots.default

      return h('div', {
        key: item.id,
        'data-widget-id': item.id,
        draggable: true,
        class: ['vxe-form-design--preview-item', `widget-${XEUtils.kebabCase(name)}`, {
          'is--active': isActive,
          'is--sort': sortWidget && sortWidget.id === item.id,
          'is--drag': dragWidget && dragWidget.id === item.id
        }],
        onDragstart: sortDragstartEvent,
        onDragend: sortDragendEvent,
        onDragenter: sortDragenterEvent,
        onDragover: dragoverItemEvent,
        onClick (evnt: KeyboardEvent) {
          handleClickEvent(evnt, item)
        }
      }, [
        h('div', {
          class: 'vxe-form-design--preview-item-view vxe-form--item-row'
        }, defaultSlot ? defaultSlot({}) : []),
        isActive
          ? h('div', {
            class: 'vxe-form-design--preview-item-operate'
          }, [
            h(VxeButtonComponent, {
              icon: getIcon().FORM_DESIGN_WIDGET_COPY,
              status: 'primary',
              size: 'mini',
              circle: true,
              onClick (params) {
                $xeFormDesign.handleCopyWidget(params.$event, item)
              }
            }),
            h(VxeButtonComponent, {
              icon: getIcon().FORM_DESIGN_WIDGET_DELETE,
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
    }
  }
})

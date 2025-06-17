import { h, PropType, inject, createCommentVNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { getIcon } from '@vxe-ui/core'
import VxeButtonComponent from '../../button/src/button'

import type { VxeFormDesignDefines, VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

export const ViewItemComponent = defineVxeComponent({
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
      const { widgetObjList } = formDesignReactData
      const divEl = evnt.currentTarget as HTMLDivElement
      const widgetId = Number(divEl.getAttribute('data-widget-id'))
      const currRest = XEUtils.findTree(widgetObjList, item => item && item.id === widgetId, { children: 'children' })
      if (currRest) {
        formDesignReactData.dragWidget = null
        formDesignReactData.sortWidget = currRest.item
      }
    }

    const sortDragendEvent = () => {
      formDesignReactData.activeWidget = formDesignReactData.sortWidget
      formDesignReactData.sortWidget = null
    }

    const sortDragenterEvent = (evnt: DragEvent) => {
      const { widgetObjList, sortWidget } = formDesignReactData
      const formDesignInternalData = $xeFormDesign.internalData
      const { lastDragTime } = formDesignInternalData
      if (lastDragTime && lastDragTime > Date.now() - 300) {
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
              if (currRest.parent && currRest.parent.name === 'row') {
                // 如是是从 row 移出
                currRest.items[currRest.index] = $xeFormDesign.createEmptyWidget()
              } else {
                currRest.items.splice(currRest.index, 1)
              }
              targetRest.items.splice(targetRest.index, 0, currRest.item)
              formDesignInternalData.lastDragTime = Date.now()
              $xeFormDesign.dispatchEvent('drag-widget', { widget: currRest.item }, evnt)
            }
          }
        }
      }
    }

    // const dragoverItemEvent = (evnt: DragEvent) => {
    //   // const { sortWidget, dragWidget } = formDesignReactData
    //   // if (sortWidget || dragWidget) {
    //   //   evnt.preventDefault()
    //   // }
    // }

    const handleClickEvent = (evnt: KeyboardEvent, item: VxeFormDesignDefines.WidgetObjItem) => {
      $xeFormDesign.handleClickWidget(evnt, item)
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
        // onDragover: dragoverItemEvent,
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

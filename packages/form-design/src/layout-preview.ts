import { defineComponent, h, inject, TransitionGroup } from 'vue'
import { renderer } from '@vxe-ui/core'
import { getSlotVNs } from '../../ui/src/vn'
import { ViewItemComponent } from './layout-view-item'
import { hasFormDesignLayoutType } from '../src/util'
import VxeFormComponent from '../../form/src/form'
import XEUtils from 'xe-utils'

import type { VxeFormDesignConstructor, VxeFormDesignPrivateMethods, VxeGlobalRendererHandles } from '../../../types'

export default defineComponent({
  name: 'FormDesignLayoutPreview',
  props: {},
  emits: [],
  setup () {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return () => []
    }

    const { reactData: formDesignReactData } = $xeFormDesign

    const dragenterEvent = (evnt: DragEvent) => {
      const { widgetObjList, dragWidget } = formDesignReactData
      if (dragWidget) {
        evnt.preventDefault()
        const rest = XEUtils.findTree(widgetObjList, item => item && item.id === dragWidget.id, { children: 'children' })
        if (!rest) {
          formDesignReactData.sortWidget = dragWidget
          widgetObjList.push(dragWidget)
          $xeFormDesign.dispatchEvent('drag-widget', { widget: dragWidget }, evnt)
        }
      }
    }

    let lastDragTime = Date.now()

    const handleDragenterPlaceEvent = (evnt: DragEvent) => {
      const { widgetObjList, sortWidget } = formDesignReactData
      evnt.stopPropagation()
      if (lastDragTime > Date.now() - 300) {
        evnt.preventDefault()
        return
      }
      if (sortWidget) {
        if (hasFormDesignLayoutType(sortWidget)) {
          return
        }
        // const targetRest = XEUtils.findTree(widgetObjList, item => item && item.id === widgetId, { children: 'children' })
        const currRest = XEUtils.findTree(widgetObjList, item => item.id === sortWidget.id, { children: 'children' })
        if (currRest) {
          const { item, index, items, parent } = currRest
          if (parent && parent.name === 'row') {
            // 如是是从 row 移出
            currRest.items[currRest.index] = $xeFormDesign.createEmptyWidget()
          } else {
            items.splice(index, 1)
          }
          widgetObjList.push(item)
          lastDragTime = Date.now()
          $xeFormDesign.dispatchEvent('drag-widget', { widget: item }, evnt)
        }
      }
    }

    return () => {
      const { widgetObjList } = formDesignReactData
      return h('div', {
        class: 'vxe-form-design--preview',
        onDragenter: dragenterEvent
      }, [
        h('div', {
          class: 'vxe-form-design--preview-wrapper'
        }, [
          h(VxeFormComponent, {
            customLayout: true,
            span: 24,
            vertical: true
          }, {
            default () {
              return h(TransitionGroup, {
                class: 'vxe-form-design--preview-list',
                tag: 'div',
                name: 'vxe-form-design--preview-list'
              }, {
                default: () => {
                  return widgetObjList.map((widget, widgetIndex) => {
                    return h(ViewItemComponent, {
                      key: widget.id,
                      item: widget,
                      itemIndex: widgetIndex,
                      items: widgetObjList
                    }, {
                      default () {
                        const { name } = widget
                        const compConf = renderer.get(name) || {}
                        const renderWidgetDesignView = compConf.renderFormDesignWidgetEdit || compConf.renderFormDesignWidgetView
                        const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = widget
                        const isEditMode = true
                        const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget, readonly: false, disabled: false, isEditMode, isViewMode: !isEditMode, $formDesign: $xeFormDesign, $formView: null }
                        return renderWidgetDesignView ? getSlotVNs(renderWidgetDesignView(renderOpts, params)) : []
                      }
                    })
                  })
                }
              })
            }
          }),
          h('div', {
            class: 'vxe-form-design--preview-place-widget',
            onDragenter: handleDragenterPlaceEvent
          })
        ])
      ])
    }
  }
})

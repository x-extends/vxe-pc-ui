import { defineComponent, h, inject, TransitionGroup } from 'vue'
import { renderer } from '@vxe-ui/core'
import { getSlotVNs } from '../../ui/src/vn'
import { ViewItemComponent } from './layout-view-item'
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

    const dragoverEvent = (evnt: DragEvent) => {
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

    return () => {
      const { widgetObjList } = formDesignReactData
      return h('div', {
        class: 'vxe-form-design--preview',
        onDragover: dragoverEvent
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
                        const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget, isEditMode: true, isViewMode: false, $formDesign: $xeFormDesign, $formView: null }
                        return renderWidgetDesignView ? getSlotVNs(renderWidgetDesignView(renderOpts, params)) : []
                      }
                    })
                  })
                }
              })
            }
          })
        ])
      ])
    }
  }
})

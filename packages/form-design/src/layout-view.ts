import { defineComponent, h, inject, TransitionGroup } from 'vue'
import { renderer } from '../../ui/src/renderer'
import { getSlotVNs } from '../../ui/src/vn'
import { ViewItemComponent } from './layout-view-item'
import VxeFormComponent from '../../form/src/form'

import { VxeFormDesignConstructor, VxeFormDesignPrivateMethods, VxeGlobalRendererHandles } from '../../../types'
import XEUtils from 'xe-utils'

export default defineComponent({
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
        }
      }
    }

    return () => {
      const { widgetObjList, formConfig } = formDesignReactData
      return h('div', {
        class: 'vxe-design-form--preview',
        onDragover: dragoverEvent
      }, [
        h(VxeFormComponent, {
          customLayout: true,
          span: 24,
          vertical: formConfig.vertical
        }, {
          default () {
            return h(TransitionGroup, {
              class: 'vxe-design-form--preview-list',
              tag: 'div',
              name: 'vxe-design-form--preview-list'
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
                      const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget, isEditMode: true, isViewMode: false }
                      return renderWidgetDesignView ? getSlotVNs(renderWidgetDesignView(renderOpts, params)) : []
                    }
                  })
                })
              }
            })
          }
        })
      ])
    }
  }
})

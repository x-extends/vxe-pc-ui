import { defineComponent, h, inject, TransitionGroup, resolveComponent } from 'vue'
import { renderer } from '../../ui/src/renderer'
import { getSlotVNs } from '../../ui/src/vn'
import { ViewItemComponent } from './view-item'

import { VxeFormDesignConstructor, VxeFormDesignPrivateMethods, VxeGlobalRendererHandles, VxeFormDesignDefines, VxeFormComponent } from '../../../types'
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
        h(resolveComponent('vxe-form') as VxeFormComponent<VxeFormDesignDefines.DefaultSettingFormObjVO>, {
          customLayout: true,
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
                      const renderWidgetView = compConf.renderFormDesignWidgetView
                      const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = widget
                      const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget }
                      return renderWidgetView ? getSlotVNs(renderWidgetView(renderOpts, params)) : []
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

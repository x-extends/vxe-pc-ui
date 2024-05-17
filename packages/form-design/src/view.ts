import { defineComponent, h, inject, TransitionGroup } from 'vue'
import { renderer } from '../../ui/src/renderer'
import { getSlotVNs } from '../../ui/src/vn'
import VxeFormComponent from '../../form/src/form'
import ViewItemComponent from './view-item'

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

    return () => {
      const { widgetObjList, formConfig } = formDesignReactData
      return h('div', {
        class: 'vxe-design-form--preview',
        onDragover: dragoverEvent
      }, [
        h(VxeFormComponent, {
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
                return widgetObjList.map((item, itemIndex) => {
                  return h(ViewItemComponent, {
                    key: item.id,
                    item,
                    itemIndex,
                    items: widgetObjList
                  }, {
                    default () {
                      const { name } = item
                      const compConf = renderer.get(name) || {}
                      const renderWidgetView = compConf.renderFormDesignWidgetView
                      const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = item
                      const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { item }
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

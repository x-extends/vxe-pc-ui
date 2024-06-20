import { defineComponent, h, inject, VNode } from 'vue'
import XEUtils from 'xe-utils'
import { getIcon, getI18n, renderer } from '@vxe-ui/core'
import { getSlotVNs } from '../../ui/src/vn'
import { getWidgetConfigIcon, getWidgetConfigTitle } from './widget-info'

import type { VxeFormDesignConstructor, VxeFormDesignPrivateMethods, VxeFormDesignDefines } from '../../../types'

export default defineComponent({
  props: {},
  emits: [],
  setup () {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return () => []
    }

    const { reactData: formDesignReactData } = $xeFormDesign

    const dragstartEvent = (evnt: DragEvent) => {
      const divEl = evnt.currentTarget as HTMLDivElement
      const dataTransfer = evnt.dataTransfer
      const widgetName = divEl.getAttribute('data-widget-name') || ''
      const dragWidget = $xeFormDesign.createWidget(widgetName)
      if (dataTransfer) {
        dataTransfer.setData('text/plain', widgetName)
      }
      formDesignReactData.sortWidget = null
      formDesignReactData.dragWidget = dragWidget
    }

    const dragendEvent = (evnt: DragEvent) => {
      if (formDesignReactData.dragWidget) {
        formDesignReactData.activeWidget = formDesignReactData.dragWidget
        $xeFormDesign.dispatchEvent('add-widget', {}, evnt)
      }
      formDesignReactData.dragWidget = null
      formDesignReactData.sortWidget = null
    }

    const cancelDragoverItem = (evnt: DragEvent, group: VxeFormDesignDefines.WidgetConfigGroup) => {
      const { widgetObjList, dragWidget } = formDesignReactData
      if (dragWidget) {
        if (group.children.some(widget => widget.name === dragWidget.name)) {
          const rest = XEUtils.findTree(widgetObjList, item => item && item.id === dragWidget.id, { children: 'children' })
          if (rest) {
            rest.items.splice(rest.index, 1)
          }
        }
      }
    }

    const addNewWidget = (evnt: KeyboardEvent, widgetName: string) => {
      const { widgetObjList } = formDesignReactData
      const dragWidget = $xeFormDesign.createWidget(widgetName)
      widgetObjList.push(dragWidget)
      formDesignReactData.activeWidget = dragWidget
      formDesignReactData.sortWidget = null
      formDesignReactData.dragWidget = null
      $xeFormDesign.dispatchEvent('add-widget', {}, evnt)
    }

    const renderWidgetList = (group: VxeFormDesignDefines.WidgetConfigGroup) => {
      const widgetVNs: VNode[] = []
      if (group.children) {
        group.children.forEach((widget, index) => {
          const { name } = widget
          const configTitle = getWidgetConfigTitle(name, $xeFormDesign)
          const compConf = renderer.get(name) || {}
          const renderWidgetItem = compConf.renderFormDesignWidgetItem
          widgetVNs.push(
            h('div', {
              key: index,
              class: 'vxe-form-design--widget-item'
            }, h('div', {
              class: 'vxe-form-design--widget-box',
              'data-widget-name': name,
              title: configTitle,
              draggable: true,
              onDragstart: dragstartEvent,
              onDragend: dragendEvent,
              onDblclick (evnt: KeyboardEvent) {
                addNewWidget(evnt, name)
              }
            }, renderWidgetItem
              ? getSlotVNs(renderWidgetItem({}, { $formDesign: $xeFormDesign }))
              : [
                  h('i', {
                    class: ['vxe-form-design--widget-item-icon', getWidgetConfigIcon(name)]
                  }),
                  h('span', {
                    class: 'vxe-form-design--widget-item-name'
                  }, configTitle),
                  h('span', {
                    class: 'vxe-form-design--widget-item-add',
                    onClick (evnt: KeyboardEvent) {
                      addNewWidget(evnt, name)
                    }
                  }, [
                    h('i', {
                      class: getIcon().FORM_DESIGN_WIDGET_ADD
                    })
                  ])
                ]))
          )
        })
      }
      return widgetVNs
    }

    const renderWidgetGroups = () => {
      const { widgetConfigs } = formDesignReactData
      return widgetConfigs.map((config, gIndex) => {
        const { title, group } = config
        return h('div', {
          key: gIndex,
          class: 'vxe-form-design--widget-group'
        }, [
          h('div', {
            class: 'vxe-form-design--widget-title'
          }, group ? getI18n(`vxe.formDesign.widget.group.${group}`) : `${title || ''}`),
          h('div', {
            class: 'vxe-form-design--widget-list',
            onDragover (evnt: DragEvent) {
              cancelDragoverItem(evnt, config)
            }
          }, renderWidgetList(config))
        ])
      })
    }

    return () => {
      return h('div', {
        class: 'vxe-form-design--widget'
      }, renderWidgetGroups())
    }
  }
})

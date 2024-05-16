import { defineComponent, h, inject, VNode } from 'vue'
import XEUtils from 'xe-utils'
import iconConfigStore from '../../ui/src/iconStore'
import { renderer } from '../../ui/src/renderer'
import { getSlotVNs } from '../../ui/src/vn'
import { getNewWidgetId } from './util'

import { VxeFormDesignPropTypes, VxeFormDesignConstructor, VxeFormDesignDefines, VxeFormDesignPrivateMethods, VxeFormProps } from '../../../types'

export default defineComponent({
  props: {},
  emits: [],
  setup () {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return
    }

    const { reactData } = $xeFormDesign

    const createWidgetFormData = (formItems: any) => {
      const data: any = {}
      XEUtils.eachTree(formItems, item => {
        const { field } = item
        if (field) {
          data[field] = null
        }
      }, { children: 'children' })
      return data
    }

    const createWidgetItem = (name: string) => {
      const { widgetObjList } = reactData
      const compConf = renderer.get(name) || {}
      let formConfig: VxeFormProps = {}
      const widgetId = getNewWidgetId(widgetObjList)
      if (compConf) {
        const createPropFormConfig = compConf.createFormDesignWidgetSettingPropFormConfig
        if (createPropFormConfig) {
          formConfig = createPropFormConfig({ name }) || {}
          formConfig.data = formConfig.data || createWidgetFormData(formConfig.items)
        }
      }
      const widgetItem: VxeFormDesignDefines.WidgetObjItem = {
        id: widgetId,
        name: name,
        formConfig,
        model: {
          update: false,
          value: ''
        }
      }
      return widgetItem
    }

    const dragstartEvent = (evnt: DragEvent) => {
      const divEl = evnt.currentTarget as HTMLDivElement
      const dataTransfer = evnt.dataTransfer
      const widgetName = divEl.getAttribute('data-widget-name') || ''
      const dragWidget = createWidgetItem(widgetName)
      if (dataTransfer) {
        dataTransfer.setData('text/plain', widgetName)
      }
      reactData.sortWidget = null
      reactData.dragWidget = dragWidget
    }

    const dragendEvent = (evnt: DragEvent) => {
      if (reactData.dragWidget) {
        reactData.activeWidget = reactData.dragWidget
        $xeFormDesign.dispatchEvent('add-widget', {}, evnt)
      }
      reactData.dragWidget = null
      reactData.sortWidget = null
    }

    const cancelDragoverItem = (evnt: DragEvent, group: VxeFormDesignPropTypes.WidgetItem) => {
      const { widgetObjList, dragWidget } = reactData
      if (dragWidget) {
        if (group.children.includes(dragWidget.name)) {
          const rest = XEUtils.findTree(widgetObjList, item => item.id === dragWidget.id, { children: 'children' })
          if (rest) {
            rest.items.splice(rest.index, 1)
            reactData.dragWidget = null
          }
        }
      }
    }

    const addNewWidget = (evnt: KeyboardEvent, widgetName: string) => {
      const { widgetObjList } = reactData
      const dragWidget = createWidgetItem(widgetName)
      widgetObjList.push(dragWidget)
      reactData.activeWidget = dragWidget
      reactData.sortWidget = null
      reactData.dragWidget = null
      $xeFormDesign.dispatchEvent('add-widget', {}, evnt)
    }

    const renderWidgetList = (group: VxeFormDesignPropTypes.WidgetItem) => {
      const widgetVNs: VNode[] = []
      if (group.children) {
        group.children.forEach((name, index) => {
          const compConf = renderer.get(name) || {}
          const widgetName = compConf.formDesignWidgetName
          const formDesignWidgetIcon = compConf.formDesignWidgetIcon
          const renderFormDesignWidgetItem = compConf.renderFormDesignWidgetItem
          widgetVNs.push(
            h('div', {
              key: index,
              class: 'vxe-design-form--widget-item'
            }, h('div', {
              class: 'vxe-design-form--widget-box',
              'data-widget-name': name,
              draggable: true,
              onDragstart: dragstartEvent,
              onDragend: dragendEvent
            }, renderFormDesignWidgetItem
              ? getSlotVNs(renderFormDesignWidgetItem({}, {}))
              : [
                  h('i', {
                    class: ['vxe-design-form--widget-item-icon', formDesignWidgetIcon]
                  }),
                  h('span', {
                    class: 'vxe-design-form--widget-item-name'
                  }, `${(XEUtils.isFunction(widgetName) ? widgetName({ name }) : widgetName) || name}`),
                  h('span', {
                    class: 'vxe-design-form--widget-item-add',
                    onClick (evnt: KeyboardEvent) {
                      addNewWidget(evnt, name)
                    }
                  }, [
                    h('i', {
                      class: iconConfigStore.DESIGN_FORM_WIDGET_ADD
                    })
                  ])
                ]))
          )
        })
      }
      return widgetVNs
    }

    const renderWidgetGroups = () => {
      const { widgetConfigs } = reactData
      return widgetConfigs.map((group, gIndex) => {
        return h('div', {
          key: gIndex,
          class: 'vxe-design-form--widget-group'
        }, [
          h('div', {
            class: 'vxe-design-form--widget-title'
          }, `${group.title}`),
          h('div', {
            class: 'vxe-design-form--widget-list',
            onDragover (evnt:DragEvent) {
              cancelDragoverItem(evnt, group)
            }
          }, renderWidgetList(group))
        ])
      })
    }

    return () => {
      return h('div', {
        class: 'vxe-design-form--widget'
      }, renderWidgetGroups())
    }
  }
})

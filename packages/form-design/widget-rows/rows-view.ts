import { PropType, defineComponent, h, inject, computed, createCommentVNode } from 'vue'
import { hasFormDesignLayoutType } from '../src/util'
import { renderer } from '../../ui/src/renderer'
import { getSlotVNs } from '../../ui/src/vn'
import iconConfigStore from '../../ui/src/iconStore'
import XEUtils from 'xe-utils'
import { WidgetRowsFormObjVO } from './rows-data'
import VxeFormGatherComponent from '../../form/src/form-gather'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeButtonComponent from '../../button/src/button'

import { VxeGlobalRendererHandles, VxeFormDesignDefines, VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

const ViewColItemComponent = defineComponent({
  props: {
    parentWidget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetRowsFormObjVO>>,
      default: () => ({})
    },
    widget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetRowsFormObjVO>>,
      default: () => ({})
    },
    span: Number,
    colItemIndex: {
      type: Number,
      default: 0
    }
  },
  emits: [],
  setup (props) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return
    }

    const { reactData: formDesignReactData } = $xeFormDesign

    const handleDragoverColItem = (evnt: DragEvent) => {
      const { parentWidget } = props
      const { widgetObjList, sortWidget } = formDesignReactData
      const currWidget = parentWidget.children[props.colItemIndex]
      evnt.stopPropagation()
      if (sortWidget && parentWidget && (!currWidget || !currWidget.name) && !hasFormDesignLayoutType(sortWidget.name)) {
        const index = XEUtils.findIndexOf(widgetObjList, item => item.id === sortWidget.id)
        if (index > -1) {
          // 动态调整子控件长度
          if (!parentWidget.children.length) {
            parentWidget.children = XEUtils.range(0, parentWidget.widgetFormData.colSize).map(() => {
              return $xeFormDesign.createEmptyWidget()
            })
          }
          parentWidget.children[props.colItemIndex] = sortWidget
          widgetObjList.splice(index, 1)
        }
      }
    }

    return () => {
      const { span } = props
      return h(VxeFormItemComponent, {
        span
      }, {
        default () {
          const { widget } = props
          const { dragWidget, activeWidget, sortWidget } = formDesignReactData
          const name = widget ? widget.name : ''
          const compConf = renderer.get(name) || {}
          const renderWidgetView = compConf.renderFormDesignWidgetView
          const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = widget || { name }
          const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget }
          const isActive = activeWidget && widget && activeWidget.id === widget.id

          return h('div', {
            class: ['vxe-design-form--widget-rows-view', {
              'is--active': isActive,
              'is--sort': sortWidget && widget && sortWidget.id === widget.id,
              'is--drag': dragWidget && widget && dragWidget.id === widget.id
            }],
            onDragover: handleDragoverColItem,
            onClick (evnt: KeyboardEvent) {
              if (widget) {
                evnt.stopPropagation()
                $xeFormDesign.handleClickWidget(evnt, widget)
              }
            }
          }, [
            renderWidgetView
              ? h('div', {}, [
                h('div', {
                  class: 'vxe-form--item-row'
                }, getSlotVNs(renderWidgetView(renderOpts, params))),
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
                        $xeFormDesign.handleCopyWidget(params.$event, widget)
                      }
                    }),
                    h(VxeButtonComponent, {
                      icon: iconConfigStore.DESIGN_FORM_WIDGET_DELETE,
                      status: 'danger',
                      size: 'mini',
                      circle: true,
                      onClick (params) {
                        $xeFormDesign.handleRemoveWidget(params.$event, widget)
                      }
                    })
                  ])
                  : createCommentVNode()
              ])
              : h('div', {
                class: 'vxe-design-form--widget-rows-view-empty'
              }, '从左侧将控件拖拽进来')
          ])
        }
      })
    }
  }
})

export const WidgetRowsViewComponent = defineComponent({
  props: {
    widget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetRowsFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return
    }

    const computedColObjList = computed(() => {
      const { widget } = props
      const { widgetFormData } = widget
      const { colSpan } = widgetFormData
      const colList = colSpan ? `${colSpan}`.split(',') : []
      const rest = colList.map((span) => Number(span))
      return rest
    })

    return () => {
      const { widget } = props
      return h(VxeFormGatherComponent, {
        span: 24
      }, {
        default () {
          const colObjList = computedColObjList.value
          return colObjList.map((span, colItemIndex) => {
            return h(ViewColItemComponent, {
              key: colItemIndex,
              parentWidget: widget,
              widget: widget.children[colItemIndex],
              span,
              colItemIndex
            })
          })
        }
      })
    }
  }
})

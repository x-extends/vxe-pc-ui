import { PropType, defineComponent, h, inject, computed, createCommentVNode } from 'vue'
import { hasFormDesignLayoutType } from '../src/util'
import { renderer, getIcon } from '@vxe-ui/core'
import { getSlotVNs } from '../../ui/src/vn'
import XEUtils from 'xe-utils'
import { WidgetRowFormObjVO } from './row-data'
import VxeFormGatherComponent from '../../form/src/form-gather'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeRowComponent from '../../row/src/row'
import VxeColComponent from '../../row/src/col'
import VxeButtonComponent from '../../button/src/button'

import type { VxeGlobalRendererHandles, VxeFormDesignDefines, VxeFormDesignConstructor, VxeFormDesignPrivateMethods } from '../../../types'

const ViewColItemComponent = defineComponent({
  props: {
    parentWidget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetRowFormObjVO>>,
      default: () => ({})
    },
    widget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetRowFormObjVO>>,
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
      return () => []
    }

    const { reactData: formDesignReactData } = $xeFormDesign

    const handleDragoverColItem = (evnt: DragEvent) => {
      const { parentWidget, colItemIndex } = props
      const { widgetObjList, sortWidget } = formDesignReactData
      const currWidget = parentWidget.children[colItemIndex]
      evnt.stopPropagation()
      if (sortWidget && parentWidget && sortWidget.id !== parentWidget.id && !hasFormDesignLayoutType(sortWidget)) {
        if ((!currWidget || !currWidget.name) && !hasFormDesignLayoutType(currWidget)) {
          const index = XEUtils.findIndexOf(widgetObjList, item => item.id === sortWidget.id)
          if (index > -1) {
            // 如果数据异常，动态修复
            if (!parentWidget.children.length) {
              parentWidget.children = XEUtils.range(0, parentWidget.options.colSize).map(() => {
                return $xeFormDesign.createEmptyWidget()
              })
            }
            parentWidget.children[colItemIndex] = sortWidget
            widgetObjList.splice(index, 1)
          }
        }
      }
    }

    return () => {
      const { widget, span } = props
      const { dragWidget, activeWidget, sortWidget } = formDesignReactData
      return h(VxeFormItemComponent, {
        span
      }, {
        default () {
          const name = widget ? widget.name : ''
          const compConf = renderer.get(name) || {}
          const renderWidgetDesignView = compConf.renderFormDesignWidgetEdit || compConf.renderFormDesignWidgetView
          const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = widget || { name }
          const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget, isEditMode: true, isViewMode: false }
          const isActive = activeWidget && widget && activeWidget.id === widget.id

          return h('div', {
            class: ['vxe-design-form--widget-row-view', {
              'is--active': isActive,
              'is--sort': sortWidget && widget && sortWidget.id === widget.id,
              'is--drag': dragWidget && widget && dragWidget.id === widget.id
            }],
            'data-widget-id': widget.id,
            onDragover: handleDragoverColItem,
            onClick (evnt: KeyboardEvent) {
              if (widget) {
                evnt.stopPropagation()
                $xeFormDesign.handleClickWidget(evnt, widget)
              }
            }
          }, [
            renderWidgetDesignView
              ? h('div', {
                class: 'vxe-design-form--widget-row-view-wrapper'
              }, [
                h('div', {
                  class: 'vxe-form--item-row'
                }, getSlotVNs(renderWidgetDesignView(renderOpts, params))),
                isActive
                  ? h('div', {
                    class: 'vxe-design-form--preview-item-operate'
                  }, [
                    h(VxeButtonComponent, {
                      icon: getIcon().DESIGN_FORM_WIDGET_COPY,
                      status: 'primary',
                      size: 'mini',
                      circle: true,
                      onClick (params) {
                        $xeFormDesign.handleCopyWidget(params.$event, widget)
                      }
                    }),
                    h(VxeButtonComponent, {
                      icon: getIcon().DESIGN_FORM_WIDGET_DELETE,
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
                class: 'vxe-design-form--widget-row-view-empty'
              }, '控件位置')
          ])
        }
      })
    }
  }
})

export const WidgetRowEditComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetEditOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetEditParams<WidgetRowFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const computedColObjList = computed(() => {
      const { renderParams } = props
      const { widget } = renderParams
      const { options } = widget
      const { colSpan } = options
      const colList = colSpan ? `${colSpan}`.split(',') : []
      const rest = colList.map((span) => Number(span))
      return rest
    })

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      return h(VxeFormGatherComponent, {}, {
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

export const WidgetRowViewComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams<WidgetRowFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const computedColObjList = computed(() => {
      const { renderParams } = props
      const { widget } = renderParams
      const { options } = widget
      const { colSpan } = options
      const colList = colSpan ? `${colSpan}`.split(',') : []
      const rest = colList.map((span) => Number(span))
      return rest
    })

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const colObjList = computedColObjList.value
      return h(VxeRowComponent, {
        gutter: 16
      }, {
        default () {
          return colObjList.map((span, colItemIndex) => {
            return h(VxeColComponent, {
              key: colItemIndex,
              class: 'vxe-form--item-row',
              span
            }, {
              default () {
                const subWidget = widget.children[colItemIndex]
                if (subWidget) {
                  const { name } = subWidget
                  const compConf = renderer.get(name) || {}
                  const renderWidgetDesignView = compConf.renderFormDesignWidgetView
                  const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = subWidget
                  const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget: subWidget, isEditMode: false, isViewMode: true }
                  if (renderWidgetDesignView) {
                    return getSlotVNs(renderWidgetDesignView(renderOpts, params))
                  }
                }
                return createCommentVNode()
              }
            })
          })
        }
      })
    }
  }
})

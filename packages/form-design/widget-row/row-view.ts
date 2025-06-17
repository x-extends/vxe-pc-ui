import { PropType, h, inject, computed, createCommentVNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { hasFormDesignLayoutType } from '../src/util'
import { renderer, getIcon } from '@vxe-ui/core'
import { getSlotVNs } from '../../ui/src/vn'
import XEUtils from 'xe-utils'
import { WidgetRowFormObjVO } from './row-data'
import VxeFormGroupComponent from '../../form/src/form-group'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeRowComponent from '../../row/src/row'
import VxeColComponent from '../../row/src/col'
import VxeButtonComponent from '../../button/src/button'

import type { VxeGlobalRendererHandles, VxeFormDesignDefines, VxeFormDesignConstructor, VxeFormDesignPrivateMethods, VxeFormViewConstructor, VxeFormViewPrivateMethods } from '../../../types'

const ViewColItemComponent = defineVxeComponent({
  name: 'ViewColItem',
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

    const handleDragstartColItemEvent = (evnt: DragEvent) => {
      evnt.stopPropagation()
      const divEl = evnt.currentTarget as HTMLDivElement
      const dataTransfer = evnt.dataTransfer
      const widgetId = divEl.getAttribute('data-widget-id') || ''
      const dragWidget = $xeFormDesign.getWidgetById(widgetId)
      if (dataTransfer) {
        dataTransfer.setData('text/plain', widgetId)
      }
      formDesignReactData.sortWidget = dragWidget
      formDesignReactData.dragWidget = null
    }

    const sortDragenterColItemEvent = (evnt: DragEvent) => {
      const { parentWidget, colItemIndex } = props
      const { widgetObjList, sortWidget } = formDesignReactData
      const targetWidget = parentWidget.children[colItemIndex]
      const formDesignInternalData = $xeFormDesign.internalData
      evnt.stopPropagation()
      if (sortWidget && parentWidget && sortWidget.id !== parentWidget.id) {
        if (hasFormDesignLayoutType(sortWidget)) {
          return
        }
        if (!hasFormDesignLayoutType(targetWidget)) {
          const currRest = XEUtils.findTree(widgetObjList, item => item && item.id === sortWidget.id, { children: 'children' })
          if (currRest) {
            const { item, index, items, parent } = currRest
            // 如果数据异常，动态修复
            if (parentWidget.children.length !== parentWidget.options.colSize) {
              parentWidget.children = XEUtils.range(0, parentWidget.options.colSize).map((index) => {
                return parentWidget.children[index] || $xeFormDesign.createEmptyWidget()
              })
            }
            // 如果是 row 内移动
            if (parent && parent.id === parentWidget.id) {
              parentWidget.children[colItemIndex] = item
              parentWidget.children[index] = targetWidget
            } else {
              // 如果已存在控件
              if (targetWidget && targetWidget.name) {
                return
              }
              parentWidget.children[colItemIndex] = item
              items.splice(index, 1)
            }
            evnt.preventDefault()
            formDesignInternalData.lastDragTime = Date.now()
            $xeFormDesign.dispatchEvent('drag-widget', { widget: item }, evnt)
          }
        }
      }
    }

    return () => {
      const { widget, span } = props
      const { dragWidget, activeWidget, sortWidget } = formDesignReactData
      return h(VxeFormItemComponent, {
        span,
        padding: false
      }, {
        default () {
          const name = widget ? widget.name : ''
          const compConf = renderer.get(name) || {}
          const renderWidgetDesignView = compConf.renderFormDesignWidgetEdit || compConf.renderFormDesignWidgetView
          const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = widget || { name }
          const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget, readonly: false, disabled: false, isEditMode: true, isViewMode: false, $formDesign: $xeFormDesign, $formView: null }
          const isActive = activeWidget && widget && activeWidget.id === widget.id
          const isEmptyWidget = !renderWidgetDesignView
          return h('div', {
            class: 'vxe-form-design--widget-row-view',
            'data-widget-id': widget.id,
            draggable: !isEmptyWidget,
            onDragstart: handleDragstartColItemEvent,
            onDragenter: sortDragenterColItemEvent,
            onClick (evnt: KeyboardEvent) {
              if (widget) {
                $xeFormDesign.handleClickWidget(evnt, widget)
              }
            }
          }, [
            h('div', {
              class: ['vxe-form-design--widget-row-view-item-inner', {
                'is--empty': isEmptyWidget,
                'is--active': isActive,
                'is--sort': sortWidget && widget && sortWidget.id === widget.id,
                'is--drag': dragWidget && widget && dragWidget.id === widget.id
              }]
            }, [
              renderWidgetDesignView
                ? h('div', {
                  class: 'vxe-form-design--widget-row-view-item-wrapper'
                }, [
                  h('div', {
                    class: 'vxe-form-design--widget-row-view-item-box vxe-form--item-row'
                  }, getSlotVNs(renderWidgetDesignView(renderOpts, params))),
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
                          $xeFormDesign.handleCopyWidget(params.$event, widget)
                        }
                      }),
                      h(VxeButtonComponent, {
                        icon: getIcon().FORM_DESIGN_WIDGET_DELETE,
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
                  class: 'vxe-form-design--widget-row-view-empty'
                }, '控件位置')
            ])
          ])
        }
      })
    }
  }
})

export const WidgetRowEditComponent = defineVxeComponent({
  name: 'WidgetRowEdit',
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
      return h(VxeFormGroupComponent, {
        field: widget.field
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

export const WidgetRowViewComponent = defineVxeComponent({
  name: 'WidgetRowView',
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
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)
    const $xeFormView = inject<(VxeFormViewConstructor & VxeFormViewPrivateMethods) | null>('$xeFormView', null)

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
      return h(VxeRowComponent, {}, {
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
                  const isEditMode = !!$xeFormDesign
                  const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget: subWidget, readonly: false, disabled: false, isEditMode, isViewMode: !isEditMode, $formDesign: $xeFormDesign, $formView: $xeFormView }
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

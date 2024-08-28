import { PropType, defineComponent, inject, h, createCommentVNode, TransitionGroup, computed } from 'vue'
import { VxeUI, renderer, getIcon, getI18n } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import { hasFormDesignLayoutType } from '../src/util'
import { WidgetSubtableFormObjVO } from './subtable-data'
import { getSlotVNs } from '../../ui/src/vn'
import { useWidgetName } from '../../form-design/src/use'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeButtonComponent from '../../button/src/button'
import VxeCheckboxComponent from '../../checkbox/src/checkbox'

import type { VxeGlobalRendererHandles, VxeFormDesignConstructor, VxeFormDesignDefines, VxeFormDesignPrivateMethods, VxeFormViewConstructor, VxeFormViewPrivateMethods, VxeGridComponent, VxeGridPropTypes } from '../../../types'

const ViewSubItemComponent = defineComponent({
  props: {
    parentWidget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetSubtableFormObjVO>>,
      default: () => ({})
    },
    widget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetSubtableFormObjVO>>,
      default: () => ({})
    },
    childIndex: {
      type: Number,
      default: 0
    }
  },
  emits: [],
  setup (props) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)
    const $xeFormView = inject<(VxeFormViewConstructor & VxeFormViewPrivateMethods) | null>('$xeFormView', null)

    if (!$xeFormDesign) {
      return () => []
    }

    const { reactData: formDesignReactData } = $xeFormDesign

    const sortDragstartSubItemEvent = (evnt: DragEvent) => {
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

    let lastDragTime = Date.now()

    const sortDragenterSubItemEvent = (evnt: DragEvent) => {
      const { parentWidget, childIndex } = props
      const { widgetObjList, sortWidget } = formDesignReactData
      const targetWidget = parentWidget.children[childIndex]
      evnt.stopPropagation()
      if (lastDragTime > Date.now() - 300) {
        evnt.preventDefault()
        return
      }
      if (sortWidget && targetWidget && parentWidget) {
        if (sortWidget.id === parentWidget.id) {
          return
        }
        if (sortWidget.id === targetWidget.id) {
          return
        }
        if (hasFormDesignLayoutType(sortWidget)) {
          return
        }
        if (targetWidget && !hasFormDesignLayoutType(targetWidget)) {
          const currRest = XEUtils.findTree(widgetObjList, item => item.id === sortWidget.id, { children: 'children' })
          if (currRest) {
            const { item, index, items, parent } = currRest
            // 如果是 subtable 内移动
            if (parent && parent.id === parentWidget.id) {
              parentWidget.children[childIndex] = item
              parentWidget.children[index] = targetWidget
            } else {
              parentWidget.children.splice(childIndex, 0, item)
              items.splice(index, 1)
            }
            lastDragTime = Date.now()
            $xeFormDesign.dispatchEvent('drag-widget', { widget: item }, evnt)
          }
        }
      }
    }

    return () => {
      const { widget } = props
      const { dragWidget, activeWidget, sortWidget } = formDesignReactData
      const name = widget ? widget.name : ''
      const compConf = renderer.get(name) || {}
      const renderWidgetDesignView = compConf.renderFormDesignWidgetEdit || compConf.renderFormDesignWidgetView
      const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = widget || { name }
      const isEditMode = !!$xeFormDesign
      const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget, readonly: false, disabled: false, isEditMode, isViewMode: !isEditMode, $formDesign: $xeFormDesign, $formView: $xeFormView }
      const isActive = activeWidget && widget && activeWidget.id === widget.id

      return h('div', {
        class: ['vxe-form-design--widget-subtable-view-item', {
          'is--active': isActive,
          'is--sort': sortWidget && widget && sortWidget.id === widget.id,
          'is--drag': dragWidget && widget && dragWidget.id === widget.id
        }],
        draggable: true,
        'data-widget-id': widget.id,
        onDragstart: sortDragstartSubItemEvent,
        onDragenter: sortDragenterSubItemEvent,
        onClick  (evnt: KeyboardEvent) {
          if (widget) {
            $xeFormDesign.handleClickWidget(evnt, widget)
          }
        }
      }, [
        h('div', {
          class: 'vxe-form-design--widget-subtable-view-item-wrapper'
        }, [
          h('div', {
            class: 'vxe-form-design--widget-subtable-view-item-box vxe-form--item-row'
          }, renderWidgetDesignView ? getSlotVNs(renderWidgetDesignView(renderOpts, params)) : []),
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
      ])
    }
  }
})

export const WidgetSubtableEditComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetEditOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetEditParams<WidgetSubtableFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return () => []
    }

    const { reactData: formDesignReactData } = $xeFormDesign

    const handleDragoverWrapperEvent = (evnt: DragEvent) => {
      const { sortWidget, widgetObjList } = formDesignReactData
      const { renderParams } = props
      const { widget } = renderParams
      evnt.stopPropagation()
      if (!sortWidget || !widget || widget.id === sortWidget.id) {
        return
      }
      if (hasFormDesignLayoutType(sortWidget)) {
        if (VxeUI.modal) {
          VxeUI.modal.message({
            content: getI18n('vxe.formDesign.widgetProp.subtableProp.errSubDrag'),
            status: 'error',
            id: 'errSubDrag'
          })
        }
        return
      }
      // 如果控件不在当前子表中，则拖进去
      if (widget.name && !widget.children.some(item => item.id === sortWidget.id)) {
        const rest = XEUtils.findTree(widgetObjList, item => item.id === sortWidget.id, { children: 'children' })
        if (rest) {
          const { item, index, items } = rest
          formDesignReactData.sortWidget = null
          formDesignReactData.activeWidget = item
          widget.children.push(item)
          items.splice(index, 1)
          formDesignReactData.sortWidget = item
        }
      }
    }

    const handleDragenterWrapperEvent = (evnt: DragEvent) => {
      evnt.stopPropagation()
    }

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const { title, children, options } = widget
      const { showCheckbox } = options

      return h(VxeFormItemComponent, {
        title,
        className: 'vxe-form-design--widget-subtable-form-item'
      }, {
        default () {
          return h('div', {
            class: 'vxe-form-design--widget-subtable-view',
            onDragenter: handleDragenterWrapperEvent,
            onDragover: handleDragoverWrapperEvent
          }, [
            h('div', {
              class: 'vxe-form-design--widget-subtable-view-left'
            }, [
              showCheckbox
                ? h('div', {
                  class: 'vxe-form-design--widget-subtable-col'
                }, [
                  h('div', {
                    class: 'vxe-form-design--widget-subtable-head'
                  }, [
                    h(VxeCheckboxComponent)
                  ]),
                  h('div', {
                    class: 'vxe-form-design--widget-subtable-body'
                  }, [
                    h(VxeCheckboxComponent)
                  ])
                ])
                : createCommentVNode(),
              h('div', {
                class: 'vxe-form-design--widget-subtable-col'
              }, [
                h('div', {
                  class: 'vxe-form-design--widget-subtable-head'
                }, getI18n('vxe.formDesign.widgetProp.subtableProp.seqTitle')),
                h('div', {
                  class: 'vxe-form-design--widget-subtable-body'
                }, '1')
              ])
            ]),
            h('div', {
              class: 'vxe-form-design--widget-subtable-view-right'
            }, [
              h('div', {
                class: 'vxe-form-design--widget-subtable-view-wrapper'
              }, [
                h(TransitionGroup, {
                  class: 'vxe-form-design--widget-subtable-view-list',
                  tag: 'div',
                  name: 'vxe-form-design--widget-subtable-view-list'
                }, {
                  default: () => {
                    return children.map((childWidget, childIndex) => {
                      return h(ViewSubItemComponent, {
                        key: childWidget.id,
                        parentWidget: widget,
                        widget: childWidget,
                        childIndex
                      })
                    })
                  }
                }),
                h('div', {
                  key: 'empty',
                  class: 'vxe-form-design--widget-subtable-view-empty'
                }, getI18n('vxe.formDesign.widgetProp.subtableProp.colPlace'))
              ])
            ])
          ])
        }
      })
    }
  }
})

export const WidgetSubtableViewComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams<WidgetSubtableFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const VxeTableGridComponent = VxeUI.getComponent<VxeGridComponent>('VxeGrid')

    const $xeFormView = inject<(VxeFormViewConstructor & VxeFormViewPrivateMethods) | null>('$xeFormView', null)

    const { computeKebabCaseName } = useWidgetName(props)

    const computeSubtableColumns = computed(() => {
      const { renderParams } = props
      const { widget } = renderParams
      const { children, options } = widget
      const columns: VxeGridPropTypes.Columns = []
      if (options.showCheckbox) {
        columns.push({
          type: 'checkbox',
          width: 60
        })
      }
      columns.push({
        type: 'seq',
        width: 60
      })
      if (children) {
        children.forEach(childWidget => {
          columns.push({
            field: childWidget.field,
            title: childWidget.title
          })
        })
      }
      return columns
    })

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const kebabCaseName = computeKebabCaseName.value
      const subtableColumns = computeSubtableColumns.value

      return h(VxeFormItemComponent, {
        class: ['vxe-form-design--widget-render-form-item', `widget-${kebabCaseName}`],
        title: widget.title,
        field: widget.field,
        span: 24
      }, {
        default () {
          return VxeTableGridComponent
            ? h(VxeTableGridComponent, {
              border: true,
              columnConfig: {
                resizable: true
              },
              data: $xeFormView ? $xeFormView.getItemValue(widget) : null,
              columns: subtableColumns
            })
            : createCommentVNode()
        }
      })
    }
  }
})

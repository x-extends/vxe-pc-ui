import { PropType, defineComponent, inject, h, createCommentVNode, TransitionGroup, computed } from 'vue'
import { VxeUI, renderer, getIcon, getI18n } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import { hasFormDesignLayoutType } from '../src/util'
import { WidgetSubtableFormObjVO } from './subtable-data'
import { getSlotVNs } from '../../ui/src/vn'
import { useKebabCaseName } from '../../form-design/src/use'
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
    }
  },
  emits: [],
  setup (props) {
    const $xeFormDesign = inject<(VxeFormDesignConstructor & VxeFormDesignPrivateMethods) | null>('$xeFormDesign', null)

    if (!$xeFormDesign) {
      return () => []
    }

    const { reactData: formDesignReactData } = $xeFormDesign

    const sortDragstartEvent = (evnt: DragEvent) => {
      evnt.stopPropagation()
      const { widgetObjList } = formDesignReactData
      const divEl = evnt.currentTarget as HTMLDivElement
      const widgetId = Number(divEl.getAttribute('data-widget-id'))
      const currRest = XEUtils.findTree(widgetObjList, item => item && item.id === widgetId, { children: 'children' })
      if (currRest) {
        formDesignReactData.dragWidget = null
        formDesignReactData.sortSubWidget = currRest.item
        formDesignReactData.sortSubWidget = currRest.item
      }
    }

    const sortDragendEvent = (evnt: DragEvent) => {
      evnt.stopPropagation()
      formDesignReactData.activeWidget = formDesignReactData.sortSubWidget
      formDesignReactData.sortWidget = null
    }

    let isDragAnimate = false

    const sortDragenterEvent = (evnt: DragEvent) => {
      const { sortSubWidget } = formDesignReactData
      if (sortSubWidget) {
        evnt.stopPropagation()
      }
      if (isDragAnimate) {
        evnt.preventDefault()
        return
      }
      const { widget, parentWidget } = props
      if (parentWidget && widget && sortSubWidget && widget.id !== sortSubWidget.id) {
        evnt.preventDefault()
        const subList = parentWidget.children.map(item => item)
        if (!subList.length) {
          parentWidget.children.push(sortSubWidget)
          isDragAnimate = false
          return
        }
        const targetIndex = XEUtils.findIndexOf(subList, item => item.id === widget.id)
        if (targetIndex > -1) {
          const sortIndex = XEUtils.findIndexOf(subList, item => item.id === sortSubWidget.id)
          if (sortIndex > -1) {
            // 控件换位置
            subList[sortIndex] = widget
            subList[targetIndex] = sortSubWidget
            parentWidget.children = subList
            isDragAnimate = true
            setTimeout(() => {
              isDragAnimate = false
            }, 150)
          }
        }
      }
    }

    const handleDragoverSubItem = (evnt: DragEvent) => {
      const { sortSubWidget } = formDesignReactData
      if (sortSubWidget) {
        evnt.preventDefault()
      }
    }

    const handleClickEvent = (evnt: KeyboardEvent) => {
      const { widget } = props
      if (widget) {
        formDesignReactData.sortSubWidget = widget
        $xeFormDesign.handleClickWidget(evnt, widget)
      }
    }

    return () => {
      const { widget } = props
      const { dragWidget, activeWidget, sortSubWidget } = formDesignReactData
      const name = widget ? widget.name : ''
      const compConf = renderer.get(name) || {}
      const renderWidgetDesignView = compConf.renderFormDesignWidgetEdit || compConf.renderFormDesignWidgetView
      const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = widget || { name }
      const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget, isEditMode: true, isViewMode: false, $formDesign: $xeFormDesign, $formView: null }
      const isActive = activeWidget && widget && activeWidget.id === widget.id

      return h('div', {
        class: ['vxe-form-design--widget-subtable-view-item', {
          'is--active': isActive,
          'is--sort': sortSubWidget && widget && sortSubWidget.id === widget.id,
          'is--drag': dragWidget && widget && dragWidget.id === widget.id
        }],
        draggable: true,
        'data-widget-id': widget.id,
        onDragstart: sortDragstartEvent,
        onDragend: sortDragendEvent,
        onDragenter: sortDragenterEvent,
        onDragover: handleDragoverSubItem,
        onClick: handleClickEvent
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

    const onDragoverEmptyWrapper = (evnt: DragEvent) => {
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
      if (widget.name && !widget.children.some(item => item.id === sortWidget.id)) {
        const rest = XEUtils.findTree(widgetObjList, item => item.id === sortWidget.id, { children: 'children' })
        if (rest) {
          const { item, index, items } = rest
          formDesignReactData.sortWidget = null
          formDesignReactData.sortSubWidget = item
          formDesignReactData.activeWidget = item
          widget.children.push(item)
          items.splice(index, 1)
        }
      }
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
            class: 'vxe-form-design--widget-subtable-view'
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
                    return children.map((childWidget) => {
                      return h(ViewSubItemComponent, {
                        key: childWidget.id,
                        parentWidget: widget,
                        widget: childWidget
                      })
                    })
                  }
                }),
                h('div', {
                  key: 'empty',
                  class: 'vxe-form-design--widget-subtable-view-empty',
                  onDragover: onDragoverEmptyWrapper
                }, '将控件拖拽进来')
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

    const computeKebabCaseName = useKebabCaseName(props)

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

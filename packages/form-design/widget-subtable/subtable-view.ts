import { PropType, defineComponent, inject, h, createCommentVNode } from 'vue'
import { renderer, getIcon } from '@vxe-ui/core'
import { WidgetSubtableFormObjVO } from './subtable-data'
import { getSlotVNs } from '../../ui/src/vn'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeButtonComponent from '../../button/src/button'

import type { VxeGlobalRendererHandles, VxeFormDesignConstructor, VxeFormDesignDefines, VxeFormDesignPrivateMethods } from '../../../types'

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

    const handleDragoverSubItem = (evnt: DragEvent) => {
      evnt.stopPropagation()
    }

    return () => {
      const { widget } = props
      const { dragWidget, activeWidget, sortWidget } = formDesignReactData
      const name = widget ? widget.name : ''
      const compConf = renderer.get(name) || {}
      const renderWidgetDesignView = compConf.renderFormDesignWidgetEdit || compConf.renderFormDesignWidgetView
      const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = widget || { name }
      const params: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget, isEditMode: true, isViewMode: false }
      const isActive = activeWidget && widget && activeWidget.id === widget.id

      return h('div', {
        class: ['vxe-form-design--widget-subtable-view-item', {
          'is--active': isActive,
          'is--sort': sortWidget && widget && sortWidget.id === widget.id,
          'is--drag': dragWidget && widget && dragWidget.id === widget.id
        }],
        'data-widget-id': widget.id,
        onDragover: handleDragoverSubItem,
        onClick (evnt: KeyboardEvent) {
          if (widget) {
            $xeFormDesign.handleClickWidget(evnt, widget)
          }
        }
      }, [
        h('div', {
          class: 'vxe-form-design--widget-subtable-view-wrapper'
        }, [
          h('div', {
            class: 'vxe-form--item-row'
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
    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const { title, children } = widget
      return h(VxeFormItemComponent, {
        title
      }, {
        default () {
          return h('div', {
            class: 'vxe-form-design--widget-subtable-view'
          }, [
            h('div', {
              class: 'vxe-form-design--widget-subtable-col'
            }, [
              h('div', {
                class: 'vxe-form-design--widget-subtable-head'
              }, '序号'),
              h('div', {
                class: 'vxe-form-design--widget-subtable-body'
              }, '1')
            ]),
            h('div', {
              class: 'vxe-form-design--widget-subtable-view-wrapper'
            }, [
              h('div', {
                class: 'vxe-form-design--widget-subtable-view-list'
              }, children.map((childWidget) => {
                return h(ViewSubItemComponent, {
                  key: childWidget.id,
                  parentWidget: widget,
                  widget: childWidget
                })
              })),
              h('div', {
                class: 'vxe-form-design--widget-subtable-view-empty'
              }, '将控件拖拽进来')
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
  setup () {
    return () => {
      return h('div', 'eeee')
    }
  }
})

import { ref, PropType, inject, h, createCommentVNode, TransitionGroup, computed, nextTick } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import { VxeUI, renderer, getIcon, getI18n } from '@vxe-ui/core'
import XEUtils from 'xe-utils'
import { hasFormDesignLayoutType } from '../src/util'
import { WidgetSubtableFormObjVO } from './subtable-data'
import { getSlotVNs } from '../../ui/src/vn'
import { useWidgetName } from '../../form-design/src/use'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeButtonComponent from '../../button/src/button'
import VxeCheckboxComponent from '../../checkbox/src/checkbox'

import type { VxeGlobalRendererHandles, VxeFormDesignConstructor, VxeFormDesignDefines, VxeFormDesignPrivateMethods, VxeFormViewConstructor, VxeFormViewPrivateMethods } from '../../../types'
import type { VxeGridComponent, VxeGridPropTypes, VxeGridProps, VxeGridInstance } from '../../../types/components/grid'
import type { VxeTableDefines } from '../../../types/components/table'
import type { VxeColumnPropTypes } from '../../../types/components/column'

const ViewSubItemComponent = defineVxeComponent({
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

    const sortDragenterSubItemEvent = (evnt: DragEvent) => {
      const { parentWidget, childIndex } = props
      const { widgetObjList, sortWidget } = formDesignReactData
      const targetWidget = parentWidget.children[childIndex]
      const formDesignInternalData = $xeFormDesign.internalData
      const { lastDragTime } = formDesignInternalData
      evnt.stopPropagation()
      if (lastDragTime && lastDragTime > Date.now() - 300) {
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
            formDesignInternalData.lastDragTime = Date.now()
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
      const renderSubtableView = compConf.renderFormDesignWidgetSubtableEditView || compConf.renderFormDesignWidgetSubtableCellView || compConf.renderFormDesignWidgetSubtableDefaultView
      const renderWidgetDesignView = compConf.renderFormDesignWidgetEdit || compConf.renderFormDesignWidgetView
      const renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions = widget || { name }
      const isEditMode = !!$xeFormDesign
      const defParams: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams = { widget, readonly: false, disabled: false, isEditMode, isViewMode: !isEditMode, $formDesign: $xeFormDesign, $formView: $xeFormView }
      const isActive = activeWidget && widget && activeWidget.id === widget.id
      const subOpts = { name }
      const subParams = {
        $table: null,
        $grid: null,
        seq: '',
        column: {
          field: widget.field,
          title: widget.title
        } as VxeTableDefines.ColumnInfo,
        columnIndex: 0,
        $columnIndex: 0,
        _columnIndex: 0,
        rowid: '',
        row: {},
        rowIndex: 0,
        $rowIndex: 0,
        _rowIndex: 0,
        isEdit: false,
        isHidden: false,
        fixed: null,
        type: '',
        level: 1,
        visibleData: [],
        items: [],
        data: [],
        widget: widget
      }

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
          }, renderSubtableView
            ? h(VxeFormItemComponent, {
              class: ['vxe-form-design--widget-render-form-item'],
              title: widget.title,
              field: widget.field,
              itemRender: {}
            }, {
              default () {
                return getSlotVNs(renderSubtableView(subOpts, subParams))
              }
            })
            : (renderWidgetDesignView
                ? getSlotVNs(renderWidgetDesignView(renderOpts, defParams))
                : [])),
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

export const WidgetSubtableEditComponent = defineVxeComponent({
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
                    return children
                      ? children.map((childWidget, childIndex) => {
                        return h(ViewSubItemComponent, {
                          key: childWidget.id,
                          parentWidget: widget,
                          widget: childWidget,
                          childIndex
                        })
                      })
                      : []
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

export const WidgetSubtableViewComponent = defineVxeComponent({
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

    const refGrid = ref<VxeGridInstance>()

    const defaultDataList = ref([
      {}
    ])

    const computeFormReadonly = computed(() => {
      if ($xeFormView) {
        return $xeFormView.props.readonly
      }
      return false
    })

    const computeSubtableColumns = computed(() => {
      const { renderParams } = props
      const { widget } = renderParams
      const { children, options } = widget
      const formReadonly = computeFormReadonly.value
      const columns: VxeGridPropTypes.Columns = []
      if (options.showCheckbox) {
        columns.push({
          type: 'checkbox',
          width: 60,
          fixed: 'left'
        })
      }
      columns.push({
        type: 'seq',
        width: 60,
        fixed: 'left'
      })
      if (children) {
        children.forEach(childWidget => {
          const { name } = childWidget
          const compConf = renderer.get(name) || {}
          const parseSubtableColumn = compConf.parseFormDesignWidgetSubtableColumn
          let colConf: VxeGridPropTypes.Column = {
            field: childWidget.field,
            title: childWidget.title
          }
          if (parseSubtableColumn) {
            colConf = Object.assign(colConf, parseSubtableColumn({
              $formView: $xeFormView,
              name: childWidget.name,
              widget: childWidget,
              readonly: !!formReadonly
            }))
          } else {
            if (formReadonly) {
              colConf.cellRender = {
                name: childWidget.name,
                props: childWidget.options
              }
            } else {
              colConf.editRender = {
                name: childWidget.name,
                props: childWidget.options
              }
            }
          }
          const renderSubtableDefaultView = compConf.renderFormDesignWidgetSubtableDefaultView
          const renderSubtableCellView = compConf.renderFormDesignWidgetSubtableCellView || renderSubtableDefaultView
          const renderSubtableEditView = compConf.renderFormDesignWidgetSubtableEditView
          const colSlots: VxeColumnPropTypes.Slots = {}
          if (renderSubtableDefaultView || renderSubtableCellView) {
            colSlots.default = (slotParams) => {
              const { isEdit, column } = slotParams
              const { editRender, cellRender } = column
              const params = Object.assign({ widget: childWidget }, slotParams)
              if (isEdit && editRender) {
                if (renderSubtableCellView) {
                  return getSlotVNs(renderSubtableCellView(editRender, params))
                }
              }
              if (renderSubtableDefaultView) {
                return getSlotVNs(renderSubtableDefaultView(cellRender || {}, params))
              }
              return []
            }
          }
          if (renderSubtableEditView) {
            colSlots.edit = (slotParams) => {
              const { column } = slotParams
              const { editRender } = column
              const params = Object.assign({ widget: childWidget }, slotParams)
              return getSlotVNs(renderSubtableEditView(editRender, params))
            }
          }
          colConf.slots = colSlots
          columns.push(colConf)
        })
      }
      if (!formReadonly) {
        columns.push({
          field: 'action',
          title: '操作',
          fixed: 'right',
          width: 80,
          slots: {
            default ({ row }) {
              return h(VxeButtonComponent, {
                mode: 'text',
                icon: 'vxe-icon-delete',
                status: 'error',
                onClick () {
                  removeSubRow(row)
                }
              })
            }
          }
        })
      }
      return columns
    })

    const computeGridOptions = computed(() => {
      const { renderParams } = props
      const { widget, isEditMode } = renderParams
      const subtableColumns = computeSubtableColumns.value
      const formReadonly = computeFormReadonly.value

      const gridConf: VxeGridProps & Required<Pick<VxeGridProps, 'toolbarConfig'>> = {
        border: true,
        showOverflow: true,
        height: 300,
        columnConfig: {
          resizable: true,
          minWidth: 140
        },
        rowConfig: {
          keyField: '_id'
        },
        data: isEditMode ? defaultDataList.value : $xeFormView ? $xeFormView.getItemValue(widget) : null,
        columns: subtableColumns,
        toolbarConfig: {
          zoom: true,
          custom: false,
          slots: {
            buttons: 'toolbarButtons'
          }
        }
      }
      if (!formReadonly) {
        gridConf.keepSource = true
        gridConf.editConfig = {
          mode: 'row',
          trigger: 'click',
          showStatus: true
        }
      }
      return gridConf
    })

    const getSubRecord = () => {
      const { renderParams } = props
      const { widget } = renderParams
      const record: Record<string, any> = {
        _id: Date.now()
      }
      XEUtils.each(widget.children, childWidget => {
        record[childWidget.field] = null
      })
      return record
    }

    const addSubRowEvent = () => {
      const { renderParams } = props
      const { widget } = renderParams
      if ($xeFormView) {
        let list: any[] = $xeFormView.getItemValue(widget)
        if (!XEUtils.isArray(list)) {
          list = []
        }
        const newRow = getSubRecord()
        list.unshift(newRow)
        $xeFormView.setItemValue(widget, list.slice(0)).then(() => {
          return nextTick().then(() => {
            const $grid = refGrid.value
            if ($grid) {
              $grid.setEditRow(newRow)
            }
          })
        })
      }
    }

    const removeSubRow = (row: any) => {
      const { renderParams } = props
      const { widget } = renderParams
      if ($xeFormView) {
        const list: any[] = $xeFormView.getItemValue(widget)
        if (list) {
          $xeFormView.setItemValue(widget, list.filter(item => item._id !== row._id))
        }
      }
    }

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const kebabCaseName = computeKebabCaseName.value
      const gridOptions = computeGridOptions.value
      const formReadonly = computeFormReadonly.value

      return h(VxeFormItemComponent, {
        class: ['vxe-form-design--widget-render-form-item', `widget-${kebabCaseName}`],
        title: widget.title,
        field: widget.field,
        span: 24
      }, {
        default () {
          return VxeTableGridComponent
            ? h(VxeTableGridComponent, {
              ...gridOptions,
              ref: refGrid
            }, {
              toolbarButtons () {
                return formReadonly
                  ? []
                  : [
                      h(VxeButtonComponent, {
                        content: '新增',
                        icon: 'vxe-icon-add',
                        status: 'primary',
                        onClick: addSubRowEvent
                      })
                    ]
              }
            })
            : createCommentVNode()
        }
      })
    }
  }
})

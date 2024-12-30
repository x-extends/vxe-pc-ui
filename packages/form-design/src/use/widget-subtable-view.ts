import { computed } from 'vue'
import XEUtils from 'xe-utils'

import type { VxeGlobalRendererHandles, VxeFormDesignDefines } from '../../../../types'
import type { VxeTableDefines } from '../../../../types/components/table'

export function useSubtableView <D = any, P = Record<string, any>> (props: {
  renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetSubtableEditViewOptions
  renderParams: VxeGlobalRendererHandles.RenderFormDesignWidgetSubtableEditViewParams
}) {
  const currWidget = computed<VxeFormDesignDefines.WidgetObjItem<P>>(() => {
    const { renderParams } = props
    return renderParams.widget
  })

  const currColumn = computed<VxeTableDefines.ColumnInfo<D>>(() => {
    const { renderParams } = props
    return renderParams.column
  })

  const currRow = computed<D>(() => {
    const { renderParams } = props
    return renderParams.row
  })

  const widgetOptions = computed<P>(() => {
    const { renderParams } = props
    const { widget } = renderParams
    return widget ? widget.options : {}
  })

  const cellModel = computed({
    get () {
      const { renderParams } = props
      const { row, column } = renderParams
      return XEUtils.get(row, column.field)
    },
    set (value) {
      const { renderParams } = props
      const { row, column } = renderParams
      return XEUtils.set(row, column.field, value)
    }
  })

  return {
    currColumn,
    currRow,
    currWidget,
    widgetOptions,
    cellModel
  }
}

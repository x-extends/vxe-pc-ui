import { computed } from 'vue'

import type { VxeGlobalRendererHandles, VxeFormDesignDefines } from '../../../../types'

export function useWidgetView <P = any> (props: {
  renderOpts: VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions
  renderParams: VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams
}) {
  const currWidget = computed<VxeFormDesignDefines.WidgetObjItem<P>>(() => {
    const { renderParams } = props
    return renderParams.widget
  })

  const isEditMode = computed(() => {
    const { renderParams } = props
    return renderParams.isEditMode || false
  })

  const isViewMode = computed(() => {
    const { renderParams } = props
    return renderParams.isViewMode || false
  })

  const widgetOptions = computed<P>(() => {
    const { renderParams } = props
    const { widget } = renderParams
    return widget ? widget.options : {}
  })

  const widgetModel = computed({
    get () {
      const { renderParams } = props
      const { $formView, widget } = renderParams
      return $formView ? $formView.getItemValue(widget) : null
    },
    set (value) {
      const { renderParams } = props
      const { $formView, widget } = renderParams
      if ($formView) {
        $formView.setItemValue(widget, value)
      }
    }
  })

  return {
    currWidget,
    widgetOptions,
    widgetModel,
    isEditMode,
    isViewMode
  }
}

import { computed } from 'vue'

import type { VxeFormDesignDefines } from '../../../types'

export function useWidgetView <T = any> (props: {
  renderOpts: any
  renderParams: any
}) {
  const currWidget = computed<VxeFormDesignDefines.WidgetObjItem<T>>(() => {
    const { renderParams } = props
    return renderParams.widget
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
    widgetModel
  }
}

import { PropType, defineComponent, h } from 'vue'
import { WidgetTextFormObjVO } from './text-data'
import { useKebabCaseName } from '../../form-design/src/use'
import VxeFormItemComponent from '../../form/src/form-item'

import type { VxeGlobalRendererHandles } from '../../../types'

export const WidgetTextViewComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams<WidgetTextFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const computeKebabCaseName = useKebabCaseName(props)

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const { options } = widget
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormItemComponent, {
        class: ['vxe-form-design--widget-render-form-item', `widget-${kebabCaseName}`],
        align: options.align
      }, {
        default () {
          return h('div', {
            style: {
              fontSize: options.fontSize,
              fontWeight: options.bold ? 'bold' : ''
            }
          }, widget.title)
        }
      })
    }
  }
})

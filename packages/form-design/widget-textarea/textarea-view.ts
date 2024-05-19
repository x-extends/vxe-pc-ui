import { PropType, defineComponent, h } from 'vue'
import { WidgetTextareaFormObjVO } from './textarea-data'
import { useKebabCaseName } from '../render/hooks'
import VxeFormItemComponent from '../../form/src/form-item'

import { VxeGlobalRendererHandles } from '../../../types'

export const WidgetTextareaViewComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams<WidgetTextareaFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const computeKebabCaseName = useKebabCaseName(props)

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const { options, model } = widget
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormItemComponent, {
        className: `vxe-design-form--widget-${kebabCaseName}-view`,
        title: widget.title,
        field: widget.field
      }, {
        default () {
          return h('textarea', {
            class: 'vxe-default-textarea',
            placeholder: options.placeholder,
            value: model.value,
            onInput (evnt: InputEvent & { target: HTMLInputElement }) {
              model.value = evnt.target.value
            }
          })
        }
      })
    }
  }
})

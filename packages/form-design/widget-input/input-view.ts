import { PropType, defineComponent, h } from 'vue'
import { WidgetInputFormObjVO } from './input-data'
import { useKebabCaseName } from '../render/hooks'
import VxeFormItemComponent from '../../form/src/form-item'

import { VxeGlobalRendererHandles, VxeFormDefines } from '../../../types'

export const createWidgetInputViewRules = (params: VxeGlobalRendererHandles.CreateFormDesignWidgetViewRulesParams<WidgetInputFormObjVO>) => {
  const { widget } = params
  const rules: VxeFormDefines.FormRule[] = []
  if (widget.required) {
    rules.push({
      required: true
    })
  }
  return rules
}

export const WidgetInputViewComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams<WidgetInputFormObjVO>>,
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
        field: widget.field,
        title: widget.title
      }, {
        default () {
          return h('input', {
            class: 'vxe-default-input',
            type: 'text',
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

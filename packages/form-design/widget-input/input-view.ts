import { PropType, defineComponent, h, inject } from 'vue'
import { WidgetInputFormObjVO } from './input-data'
import { useKebabCaseName } from '../render/hooks'
import VxeFormItemComponent from '../../form/src/form-item'

import type { VxeGlobalRendererHandles, VxeFormViewConstructor, VxeFormViewPrivateMethods } from '../../../types'

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
    const $xeFormView = inject<(VxeFormViewConstructor & VxeFormViewPrivateMethods) | null>('$xeFormView', null)

    const computeKebabCaseName = useKebabCaseName(props)

    const inputEvent = (evnt: InputEvent & { target: HTMLInputElement }) => {
      const { renderParams } = props
      const { widget } = renderParams
      if ($xeFormView) {
        $xeFormView.setItemValue(widget, evnt.target.value)
      }
    }

    const changeEvent = (evnt: InputEvent & { target: HTMLInputElement }) => {
      const { renderParams } = props
      const { widget } = renderParams
      if ($xeFormView) {
        $xeFormView.updateItemStatus(widget, evnt.target.value)
      }
    }

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const { options } = widget
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
            value: $xeFormView ? $xeFormView.getItemValue(widget) : null,
            onInput: inputEvent,
            onChange: changeEvent
          })
        }
      })
    }
  }
})

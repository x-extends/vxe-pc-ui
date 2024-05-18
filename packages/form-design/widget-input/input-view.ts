import { PropType, defineComponent, h, resolveComponent } from 'vue'
import { WidgetInputFormObjVO } from './input-data'
import { useKebabCaseName } from '../render/hooks'

import { VxeFormDesignDefines, VxeFormItemComponent } from '../../../types'

export const WidgetInputViewComponent = defineComponent({
  props: {
    widget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetInputFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const computeKebabCaseName = useKebabCaseName(props)

    return () => {
      const { widget } = props
      const { widgetFormData, model } = widget
      const kebabCaseName = computeKebabCaseName.value

      return h(resolveComponent('vxe-form-item') as VxeFormItemComponent, {
        className: `vxe-design-form--widget-${kebabCaseName}-view`,
        title: widgetFormData.itemTitle,
        span: 24
      }, {
        default () {
          return h('input', {
            class: 'vxe-default-input',
            type: 'text',
            placeholder: widgetFormData.placeholder,
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

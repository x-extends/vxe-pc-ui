import { PropType, defineComponent, h, resolveComponent } from 'vue'
import { WidgetTextareaFormObjVO } from './textarea-data'
import { useKebabCaseName } from '../render/hooks'

import { VxeFormDesignDefines, VxeFormItemComponent } from '../../../types'

export const WidgetTextareaViewComponent = defineComponent({
  props: {
    widget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetTextareaFormObjVO>>,
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
        span: 24,
        data: {}
      }, {
        default () {
          return h('textarea', {
            class: 'vxe-default-textarea',
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

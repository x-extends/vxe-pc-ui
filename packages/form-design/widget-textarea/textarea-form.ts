import { PropType, defineComponent, h, resolveComponent } from 'vue'
import { WidgetTextareaFormObjVO } from './textarea-data'
import { useKebabCaseName } from '../render/hooks'

import { VxeFormDesignDefines, VxeFormComponent, VxeFormItemComponent } from '../../../types'

export const WidgetTextareaFormComponent = defineComponent({
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
      const { widgetFormData } = widget
      const kebabCaseName = computeKebabCaseName.value

      return h(resolveComponent('vxe-form') as VxeFormComponent<WidgetTextareaFormObjVO>, {
        class: `vxe-design-form--widget-${kebabCaseName}-form`,
        vertical: true,
        span: 24,
        data: widgetFormData
      }, {
        default () {
          return [
            h(resolveComponent('vxe-form-item') as VxeFormItemComponent, {
              title: '控件名称',
              field: 'itemTitle',
              itemRender: { name: 'VxeInput' }
            }),
            h(resolveComponent('vxe-form-item') as VxeFormItemComponent, {
              title: '控件提示',
              field: 'placeholder',
              itemRender: { name: 'VxeInput' }
            })
          ]
        }
      })
    }
  }
})

import { PropType, defineComponent, h } from 'vue'
import VxeFormComponent from '../../form/src/form'
import VxeFormItemComponent from '../../form/src/form-item'
import { WidgetInputFormObjVO } from './input-data'
import { useKebabCaseName } from '../render/hooks'

import { VxeFormDesignDefines } from '../../../types'

export const WidgetInputFormComponent = defineComponent({
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
      const { widgetFormData } = widget
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormComponent, {
        class: `vxe-design-form--widget-${kebabCaseName}-form`,
        vertical: true,
        span: 24,
        data: widgetFormData
      }, {
        default () {
          return [
            h(VxeFormItemComponent, {
              title: '控件名称',
              field: 'itemTitle',
              itemRender: { name: 'VxeInput' }
            }),
            h(VxeFormItemComponent, {
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

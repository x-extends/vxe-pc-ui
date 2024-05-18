import { PropType, defineComponent, h } from 'vue'
import VxeFormItemComponent from '../../form/src/form-item'
import { WidgetSelectFormObjVO } from './select-data'
import { useKebabCaseName } from '../render/hooks'

import { VxeFormDesignDefines } from '../../../types'

export const WidgetSelectViewComponent = defineComponent({
  props: {
    widget: {
      type: Object as PropType<VxeFormDesignDefines.WidgetObjItem<WidgetSelectFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const computeKebabCaseName = useKebabCaseName(props)

    const renderOptions = () => {
      const { widget } = props
      const { widgetFormData } = widget
      const { options } = widgetFormData
      return options
        ? options.map(group => {
          if (group.options) {
            return h('optgroup', {
              label: group.value
            }, group.options.map(item => {
              return h('option', {
                value: item.value
              }, item.value)
            }))
          }
          return h('option', {}, group.value)
        })
        : []
    }

    return () => {
      const { widget } = props
      const { widgetFormData, model } = widget
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormItemComponent, {
        className: `vxe-design-form--widget-${kebabCaseName}-view`,
        title: widgetFormData.itemTitle,
        span: 24
      }, {
        default () {
          return h('select', {
            class: 'vxe-default-select',
            value: model.value
          }, renderOptions())
        }
      })
    }
  }
})

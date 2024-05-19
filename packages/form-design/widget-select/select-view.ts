import { PropType, defineComponent, h } from 'vue'
import VxeFormItemComponent from '../../form/src/form-item'
import { WidgetSelectFormObjVO } from './select-data'
import { useKebabCaseName } from '../render/hooks'

import { VxeGlobalRendererHandles } from '../../../types'

export const WidgetSelectViewComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams<WidgetSelectFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const computeKebabCaseName = useKebabCaseName(props)

    const renderOptions = () => {
      const { renderParams } = props
      const { widget } = renderParams
      const { options } = widget.options
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
      const { renderParams } = props
      const { widget, isViewMode } = renderParams
      const { model } = widget
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormItemComponent, {
        className: `vxe-design-form--widget-${kebabCaseName}-view`,
        field: widget.field,
        title: widget.title
      }, {
        default () {
          return h('select', {
            class: 'vxe-default-select',
            value: model.value
          }, isViewMode ? renderOptions() : [])
        }
      })
    }
  }
})

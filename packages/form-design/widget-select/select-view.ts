import { PropType, defineComponent, h, inject } from 'vue'
import VxeFormItemComponent from '../../form/src/form-item'
import { WidgetSelectFormObjVO } from './select-data'
import { useKebabCaseName } from '../render/hooks'

import { VxeGlobalRendererHandles, VxeFormViewConstructor, VxeFormViewPrivateMethods } from '../../../types'

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
    const $xeFormView = inject<(VxeFormViewConstructor & VxeFormViewPrivateMethods) | null>('$xeFormView', null)

    const computeKebabCaseName = useKebabCaseName(props)

    const changeEvent = (evnt: Event & { target: HTMLSelectElement }) => {
      const { renderParams } = props
      const { widget } = renderParams
      if ($xeFormView) {
        $xeFormView.setItemValue(widget, evnt.target.value)
      }
    }

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
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormItemComponent, {
        className: `vxe-design-form--widget-${kebabCaseName}-view`,
        field: widget.field,
        title: widget.title
      }, {
        default () {
          return h('select', {
            class: 'vxe-default-select',
            value: $xeFormView ? $xeFormView.getItemValue(widget) : null,
            onChange: changeEvent
          }, isViewMode ? renderOptions() : [])
        }
      })
    }
  }
})

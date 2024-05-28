import { PropType, defineComponent, h, inject } from 'vue'
import { WidgetVxeRadioGroupFormObjVO } from './vxe-radio-group-data'
import { useKebabCaseName } from '../render/hooks'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeRadioGroupComponent from '../../radio/src/group'

import type { VxeGlobalRendererHandles, VxeFormViewConstructor, VxeFormViewPrivateMethods } from '../../../types'

export const WidgetVxeRadioGroupViewComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams<WidgetVxeRadioGroupFormObjVO>>,
      default: () => ({})
    }
  },
  emits: [],
  setup (props) {
    const $xeFormView = inject<(VxeFormViewConstructor & VxeFormViewPrivateMethods) | null>('$xeFormView', null)

    const computeKebabCaseName = useKebabCaseName(props)

    const changeEvent = () => {
      const { renderParams } = props
      const { widget } = renderParams
      if ($xeFormView) {
        const itemValue = $xeFormView ? $xeFormView.getItemValue(widget) : null
        $xeFormView.updateItemStatus(widget, itemValue)
      }
    }

    return () => {
      const { renderParams } = props
      const { widget } = renderParams
      const { options } = widget
      const kebabCaseName = computeKebabCaseName.value

      return h(VxeFormItemComponent, {
        class: ['vxe-form-design--widget-render-form-item', `widget-${kebabCaseName}`],
        title: widget.title,
        field: widget.field
      }, {
        default () {
          return h(VxeRadioGroupComponent, {
            modelValue: $xeFormView ? $xeFormView.getItemValue(widget) : null,
            options: options.options,
            optionProps: { label: 'value', value: 'value' },
            onChange: changeEvent,
            'onUpdate:modelValue' (val) {
              if ($xeFormView) {
                $xeFormView.setItemValue(widget, val)
              }
            }
          })
        }
      })
    }
  }
})

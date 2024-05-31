import { PropType, defineComponent, h, inject } from 'vue'
import { WidgetVxeUploadImageFormObjVO } from './vxe-upload-image-data'
import { useKebabCaseName } from '../render/hooks'
import VxeFormItemComponent from '../../form/src/form-item'
import VxeUploadComponent from '../../upload/src/upload'

import type { VxeGlobalRendererHandles, VxeFormViewConstructor, VxeFormViewPrivateMethods } from '../../../types'

export const WidgetVxeUploadImageViewComponent = defineComponent({
  props: {
    renderOpts: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewOptions>,
      default: () => ({})
    },
    renderParams: {
      type: Object as PropType<VxeGlobalRendererHandles.RenderFormDesignWidgetViewParams<WidgetVxeUploadImageFormObjVO>>,
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
          return h(VxeUploadComponent, {
            modelValue: $xeFormView ? $xeFormView.getItemValue(widget) : null,
            mode: 'image',
            multiple: options.multiple,
            limitCount: options.limitCount,
            limitSize: options.limitSize,
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

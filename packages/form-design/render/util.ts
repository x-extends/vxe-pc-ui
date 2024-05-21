import { getI18n } from '@vxe-ui/core'

export const getFormDesignWidgetName = (name: string) => {
  return getI18n(`vxe.formDesign.widget.component.${name}`)
}

import { getI18n } from '../../ui/src/i18n'

export const getFormDesignWidgetName = (name: string) => {
  return getI18n(`vxe.formDesign.widget.component.${name}`)
}

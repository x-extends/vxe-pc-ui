import { getI18n } from '@vxe-ui/core'

export const getFormDesignWidgetName = (name: string) => {
  return getI18n(`vxe.formDesign.widget.component.${name}`)
}

export const handleGetFormDesignWidgetName = (params: { name: string }) => {
  return getFormDesignWidgetName(params.name)
}

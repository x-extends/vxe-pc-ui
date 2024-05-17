import { defineComponent, ref, h, PropType, reactive, provide, watch } from 'vue'
import globalConfigStore from '../../ui/src/globalStore'
import { renderer } from '../../ui/src/renderer'
import { getI18n } from '../../ui/src/i18n'
import { toCssUnit } from '../../ui/src/dom'
import { createWidgetItem } from './util'
import XEUtils from 'xe-utils'
import WidgetComponent from './widget'
import ViewComponent from './view'
import SettingComponent from './setting'
import { getDefaultSettingFormData } from './setting-form'

import { VxeFormPropTypes, VxeFormDesignDefines, VxeFormDesignPropTypes, VxeFormDesignEmits, FormDesignReactData, FormDesignPrivateRef, VxeFormDesignPrivateComputed, VxeFormDesignConstructor, VxeFormDesignPrivateMethods, FormDesignMethods, FormDesignPrivateMethods, VxeFormProps } from '../../../types'

export default defineComponent({
  name: 'VxeFormDesign',
  props: {
    size: {
      type: String as PropType<VxeFormDesignPropTypes.Size>,
      default: () => globalConfigStore.formDesign.size
    },
    modelValue: Array as PropType<VxeFormDesignPropTypes.ModelValue>,
    height: [String, Number] as PropType<VxeFormDesignPropTypes.Height>,
    widgets: {
      type: Array as PropType<VxeFormDesignPropTypes.Widgets>,
      default: () => XEUtils.clone(globalConfigStore.formDesign.widgets) || []
    },
    formData: {
      type: Array as PropType<VxeFormDesignPropTypes.FormData>,
      default: () => XEUtils.clone(globalConfigStore.formDesign.formData, true)
    },
    formRender: Object as PropType<VxeFormDesignPropTypes.FormRender>
  },
  emits: [
    'update:modelValue',
    'click-widget',
    'add-widget',
    'copy-widget',
    'remove-widget'
  ] as VxeFormDesignEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<FormDesignReactData>({
      formConfig: {},
      formData: {} as VxeFormDesignDefines.DefaultSettingFormObjVO,
      formItems: [],
      widgetConfigs: [],
      widgetObjList: [],
      dragWidget: null,
      sortWidget: null,
      activeWidget: null
    })

    const refMaps: FormDesignPrivateRef = {
      refElem
    }

    const computeMaps: VxeFormDesignPrivateComputed = {
    }

    const $xeFormDesign = {
      xID,
      props,
      context,
      reactData,

      getRefMaps: () => refMaps,
      getComputeMaps: () => computeMaps
    } as unknown as VxeFormDesignConstructor & VxeFormDesignPrivateMethods

    const formDesignMethods: FormDesignMethods = {
      dispatchEvent (type, params, evnt) {
        emit(type, Object.assign({ $xeFormDesign, $event: evnt }, params))
      }
    }

    const updateWidgetConfigs = () => {
      const { widgets } = props
      let widgetConfs: VxeFormDesignDefines.WidgetConfigItem[] = []
      if (widgets && widgets.length) {
        widgetConfs = props.widgets.slice(0)
      } else {
        const baseWidgets: string[] = []
        const layoutWidgets: string[] = []
        const advancedWidgets: string[] = []
        const customGroups: VxeFormDesignDefines.WidgetConfigItem[] = []
        renderer.forEach((item, name) => {
          const { formDesignWidgetName, formDesignWidgetGroup, formDesignWidgetCustomGroup } = item
          if (formDesignWidgetName) {
            // 如果自定义组
            if (formDesignWidgetCustomGroup) {
              const cusGroup = customGroups.find(item => item.title === formDesignWidgetCustomGroup)
              if (cusGroup) {
                cusGroup.children.push(name)
              } else {
                customGroups.push({
                  title: formDesignWidgetCustomGroup,
                  children: [name]
                })
              }
            } else {
              switch (formDesignWidgetGroup) {
                case 'layout':
                  layoutWidgets.push(name)
                  break
                case 'advanced':
                  advancedWidgets.push(name)
                  break
                default:
                  baseWidgets.push(name)
                  break
              }
            }
          }
        })
        if (baseWidgets.length) {
          widgetConfs.push({
            title: getI18n('vxe.formDesign.widget.baseGroup'),
            children: baseWidgets
          })
        }
        if (layoutWidgets.length) {
          widgetConfs.push({
            title: getI18n('vxe.formDesign.widget.layoutGroup'),
            children: layoutWidgets
          })
        }
        if (advancedWidgets.length) {
          widgetConfs.push({
            title: getI18n('vxe.formDesign.widget.advancedGroup'),
            children: advancedWidgets
          })
        }
        if (customGroups.length) {
          widgetConfs.push(...customGroups)
        }
      }
      reactData.widgetConfigs = widgetConfs
    }

    const formDesignPrivateMethods: FormDesignPrivateMethods = {
      handleClickWidget (evnt: KeyboardEvent, item: VxeFormDesignDefines.WidgetObjItem) {
        reactData.activeWidget = item
        formDesignMethods.dispatchEvent('click-widget', { item }, evnt)
      },
      handleCopyWidget (evnt: KeyboardEvent, item: VxeFormDesignDefines.WidgetObjItem) {
        const { widgetObjList } = reactData
        const index = XEUtils.findIndexOf(widgetObjList, obj => obj.id === item.id)
        if (index > -1) {
          evnt.stopPropagation()
          const newWidgetItem = createWidgetItem(item.name, widgetObjList)
          // 标题副本
          if (newWidgetItem.widgetFormData.itemTitle) {
            XEUtils.set(newWidgetItem, 'formConfig.data.itemTitle', getI18n('vxe.formDesign.widget.copyTitle', [`${XEUtils.get(item, 'formConfig.data.itemTitle', '')}`.replace(getI18n('vxe.formDesign.widget.copyTitle', ['']), '')]))
          }
          if (index >= widgetObjList.length - 1) {
            widgetObjList.push(newWidgetItem)
          } else {
            widgetObjList.splice(index + 1, 0, newWidgetItem)
          }
          reactData.activeWidget = newWidgetItem
          formDesignMethods.dispatchEvent('copy-widget', { targetItem: item, newItem: newWidgetItem }, evnt)
        }
      },
      handleRemoveWidget (evnt: KeyboardEvent, item: VxeFormDesignDefines.WidgetObjItem) {
        const { widgetObjList } = reactData
        const index = XEUtils.findIndexOf(widgetObjList, obj => obj.id === item.id)
        if (index > -1) {
          evnt.stopPropagation()
          if (index >= widgetObjList.length - 1) {
            reactData.activeWidget = widgetObjList[index - 1]
          } else {
            reactData.activeWidget = widgetObjList[index + 1]
          }
          widgetObjList.splice(index, 1)
          formDesignMethods.dispatchEvent('remove-widget', { item }, evnt)
        }
      }
    }

    const createSettingForm = () => {
      const { formRender } = props
      let formConfig: VxeFormProps = getDefaultSettingFormData()
      let formData = {} as VxeFormDesignDefines.DefaultSettingFormObjVO
      let formItems: VxeFormPropTypes.Items = []
      if (formRender) {
        const compConf = renderer.get(formRender.name)
        const createFormConfig = compConf ? compConf.createFormDesignSettingFormConfig : null
        formConfig = (createFormConfig ? createFormConfig({}) : {}) || {}
      }
      formData = formConfig.data || {}
      formItems = formConfig.items || []
      delete formConfig.data
      delete formConfig.items

      reactData.formConfig = formConfig
      reactData.formData = formData
      reactData.formItems = formItems
    }

    Object.assign($xeFormDesign, formDesignMethods, formDesignPrivateMethods)

    const renderVN = () => {
      const { height } = props
      return h('div', {
        ref: refElem,
        class: 'vxe-design-form',
        style: height
          ? {
              height: toCssUnit(height)
            }
          : null
      }, [
        h(WidgetComponent),
        h(ViewComponent),
        h(SettingComponent)
      ])
    }

    $xeFormDesign.renderVN = renderVN

    watch(() => props.widgets, () => {
      updateWidgetConfigs()
    })

    watch(() => props.formRender, () => {
      createSettingForm()
    })

    createSettingForm()
    updateWidgetConfigs()

    provide('$xeFormDesign', $xeFormDesign)

    return $xeFormDesign
  },
  render () {
    return this.renderVN()
  }
})

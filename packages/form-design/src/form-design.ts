import { defineComponent, ref, h, PropType, reactive, provide, watch } from 'vue'
import globalConfigStore from '../../ui/src/globalStore'
import { renderer } from '../../ui/src/renderer'
import XEUtils from 'xe-utils'
import WidgetComponent from './widget'
import ViewComponent from './view'
import SettingComponent from './setting'

import { VxeFormDesignDefines, VxeFormDesignPropTypes, VxeFormDesignEmits, FormDesignReactData, FormDesignPrivateRef, VxeFormDesignPrivateComputed, VxeFormDesignConstructor, VxeFormDesignPrivateMethods, FormDesignMethods, FormDesignPrivateMethods, VxeFormProps } from '../../../types'

export default defineComponent({
  name: 'VxeFormDesign',
  props: {
    size: {
      type: String as PropType<VxeFormDesignPropTypes.Size>,
      default: () => globalConfigStore.formDesign.size
    },
    widgets: {
      type: Array as PropType<VxeFormDesignPropTypes.Widgets>,
      default: () => []
    },
    formRender: Object as PropType<VxeFormDesignPropTypes.FormRender>
  },
  emits: [
    'add-widget',
    'remove-widget'
  ] as VxeFormDesignEmits,
  setup (props, context) {
    const { emit } = context

    const xID = XEUtils.uniqueId()

    const refElem = ref<HTMLDivElement>()

    const reactData = reactive<FormDesignReactData>({
      formConfig: {},
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
      reactData.widgetConfigs = props.widgets && props.widgets.length ? props.widgets.slice(0) : []
    }

    const formDesignPrivateMethods: FormDesignPrivateMethods = {
      handleClickWidget (evnt: KeyboardEvent, item: VxeFormDesignDefines.WidgetObjItem) {
        reactData.activeWidget = item
      }
    }

    const createDefaultSettingForm = () => {
      return {
        data: {
          showPC: true,
          showMobile: true
        }
      }
    }

    const createSettingForm = () => {
      const { formRender } = props
      let formConfig: VxeFormProps = createDefaultSettingForm()
      if (formRender) {
        const compConf = renderer.get(formRender.name)
        const createFormConfig = compConf ? compConf.createFormDesignWidgetSettingFormConfig : null
        formConfig = (createFormConfig ? createFormConfig({}) : {}) || {}
      }
      reactData.formConfig = formConfig
    }

    Object.assign($xeFormDesign, formDesignMethods, formDesignPrivateMethods)

    const renderVN = () => {
      return h('div', {
        ref: refElem,
        class: 'vxe-design-form'
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

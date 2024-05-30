import { defineComponent, h, ref } from 'vue'
import { getI18n, getIcon } from '@vxe-ui/core'
import VxeTabsComponent from '../../tabs/src/tabs'
import VxeTabPaneComponent from '../../tabs/src/tab-pane'
import { DefaultFieldSettingFormComponent, DefaultListSettingFormComponent } from './default-setting-form'

export default defineComponent({
  name: 'ListDesignLayoutSetting',
  props: {},
  emits: [],
  setup () {
    const activeTab = ref(1)

    return () => {
      return h('div', {
        class: 'vxe-list-design--setting'
      }, [
        h('div', {
          class: 'vxe-list-design--setting-form'
        }, [
          h(VxeTabsComponent, {
            modelValue: activeTab.value,
            titleWidth: '50%',
            titleAlign: 'center',
            padding: true,
            class: 'vxe-list-design--setting-form-tabs',
            'onUpdate:modelValue' (val) {
              activeTab.value = val
            }
          }, {
            default () {
              return [
                h(VxeTabPaneComponent, {
                  title: getI18n('vxe.listDesign.fieldSettingTab'),
                  icon: getIcon().LIST_DESIGN_FIELD_SETTING,
                  name: 1
                }, {
                  default () {
                    return h(DefaultFieldSettingFormComponent)
                  }
                }),
                h(VxeTabPaneComponent, {
                  title: getI18n('vxe.listDesign.listSettingTab'),
                  icon: getIcon().LIST_DESIGN_LIST_SETTING,
                  name: 2
                }, {
                  default () {
                    return h(DefaultListSettingFormComponent)
                  }
                })
              ]
            }
          })
        ])
      ])
    }
  }
})

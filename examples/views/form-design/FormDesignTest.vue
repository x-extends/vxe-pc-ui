<template>
  <div>
    <p>电脑端</p>
    <vxe-button @click="clickEvent">获取JSON</vxe-button>
    <VxeFormDesign ref="formDesignRef" :height="800" />

    <p>电脑端和手机端</p>
    <VxeFormDesign :height="400" :widgets="widgetConfigs" showMobile />

    <p @click="previewEvent">点击预览</p>

    <VxeFormView v-model="formDesignFormData" :config="formDesignConfig" />
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { VxeFormDesignInstance, VxeFormDesignPropTypes, VxeFormViewPropTypes } from '../../../types'

const formDesignRef = ref<VxeFormDesignInstance>()

const widgetConfigs = ref<VxeFormDesignPropTypes.Widgets>([
  {
    customGroup: 'xxx',
    children: [
      'input',
      'textarea'
    ]
  },
  {
    group: 'layout',
    children: [
      'VxeInput',
      'VxeTextarea'
    ]
  }
])

const formDesignFormData = ref({})
const formDesignConfig = ref<VxeFormViewPropTypes.Config>(null)

const previewEvent = () => {
  const $formDesign = formDesignRef.value
  if ($formDesign) {
    formDesignConfig.value = $formDesign.getConfig()
  }
}

const clickEvent = () => {
  const $formDesign = formDesignRef.value
  if ($formDesign) {
    console.log(JSON.stringify($formDesign.getConfig()))
  }
}

nextTick(() => {
  const $formDesign = formDesignRef.value
  if ($formDesign) {
    $formDesign.loadConfig(
      { formConfig: { title: '', pcVisible: true, pcVertical: true, pcTitleBold: true, pcTitleColon: false, pcTitleAlign: '', pcTitleWidth: '', pcTitleWidthUnit: '', mobileVisible: false, mobileVertical: true, mobileTitleBold: true, mobileTitleColon: false, mobileTitleAlign: '', mobileTitleWidth: '', mobileTitleWidthUnit: '' }, widgetData: [{ id: 100046, field: 'VxeTextarea100046', title: '文本域', name: 'VxeTextarea', required: false, hidden: false, options: { placeholder: '' }, children: [], model: { update: false, value: null } }, { id: 100049, field: 'row100049', title: '一行多列', name: 'row', required: false, hidden: false, options: { colSize: 3, colSpan: '8,8,8' }, children: [{ id: 100183, field: 'VxeInput100183', title: '输入框', name: 'VxeInput', required: false, hidden: false, options: { placeholder: '' }, children: [], model: { update: false, value: null } }, { id: 100193, field: 'VxeNumberInput100193', title: '数字', name: 'VxeNumberInput', required: false, hidden: false, options: { placeholder: '' }, children: [], model: { update: false, value: null } }, { id: 100192, field: '100192', title: '', name: '', required: false, hidden: false, options: {}, children: [], model: { update: false, value: null } }], model: { update: false, value: null } }, { id: 100194, field: 'input100194', title: '输入框', name: 'input', required: false, hidden: false, options: { placeholder: '' }, children: [], model: { update: false, value: null } }, { id: 100186, field: 'subtable100186', title: '子表', name: 'subtable', required: false, hidden: false, options: { showCheckbox: false }, children: [{ id: 100185, field: 'VxeDatePicker100185', title: '日期', name: 'VxeDatePicker', required: false, hidden: false, options: { placeholder: '', defaultValue: { type: '', value: '' } }, children: [], model: { update: false, value: null } }, { id: 100187, field: 'input100187', title: '输入框', name: 'input', required: false, hidden: false, options: { placeholder: '' }, children: [], model: { update: false, value: null } }], model: { update: false, value: null } }, { id: 100188, field: 'VxeNumberInput100188', title: '数字', name: 'VxeNumberInput', required: false, hidden: false, options: { placeholder: '' }, children: [], model: { update: false, value: null } }, { id: 100195, field: 'VxeNumberInput100195', title: '数字', name: 'VxeNumberInput', required: false, hidden: false, options: { placeholder: '' }, children: [], model: { update: false, value: null } }] }
    )
  }
})
</script>

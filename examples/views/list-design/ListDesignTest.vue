<template>
  <div>
    <vxe-list-design ref="listDesignRef" :height="600"></vxe-list-design>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { VxeListDesignInstance } from '../../../types'

const listDesignRef = ref<VxeListDesignInstance>()

nextTick(() => {
  const $listDesign = listDesignRef.value
  if ($listDesign) {
    $listDesign.setFormDesignConfig(
      { formConfig: { title: '', pcVisible: true, pcVertical: true, pcTitleBold: false, pcTitleColon: false, pcTitleAlign: '', pcTitleWidth: '', pcTitleWidthUnit: '', mobileVisible: false, mobileVertical: true, mobileTitleBold: false, mobileTitleColon: false, mobileTitleAlign: '', mobileTitleWidth: '', mobileTitleWidthUnit: '' }, widgetData: [{ id: 100031, field: 'input100031', title: '输入框', name: 'input', required: false, options: { placeholder: '' }, children: [], model: { update: false, value: '' } }, { id: 100032, field: 'VxeInput100032', title: '输入框', name: 'VxeInput', required: false, options: { placeholder: '' }, children: [], model: { update: false, value: '' } }, { id: 100034, field: 'VxeTextarea100034', title: '文本域', name: 'VxeTextarea', required: false, options: { placeholder: '' }, children: [], model: { update: false, value: '' } }, { id: 100033, field: 'VxeSelect100033', title: '下拉框', name: 'VxeSelect', required: false, options: { placeholder: '', options: [{ value: '选项1', _X_OPTION_KEY: 'opt_61' }, { value: '选项2', _X_OPTION_KEY: 'opt_62' }, { value: '选项3', _X_OPTION_KEY: 'opt_63' }] }, children: [], model: { update: false, value: '' } }] }
    )
  }
})
</script>

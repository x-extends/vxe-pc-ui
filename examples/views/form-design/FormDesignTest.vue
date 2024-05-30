<template>
  <div>
    <p>电脑端</p>
    <vxe-button @click="clickEvent">获取JSON</vxe-button>
    <VxeFormDesign ref="formDesignRef" :height="400" />

    <p>电脑端和手机端</p>
    <VxeFormDesign :height="400" :widgets="widgetConfigs" showMobile />

    <p @click="previewEvent">点击预览</p>

    <VxeFormView v-model="formDesignFormData" :config="formDesignConfig" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
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
</script>

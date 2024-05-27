<template>
  <div>
    <p>电脑端</p>
    <VxeFormDesign ref="formDesignRef" :widgets="widgetConfigs" :height="400" />

    <p>电脑端和手机端</p>
    <VxeFormDesign :height="400" showMobile />

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
      'input'
    ]
  },
  {
    group: 'layout',
    children: [
      'input'
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
</script>

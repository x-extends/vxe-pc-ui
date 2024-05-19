<template>
  <div>
    <VxeFormDesign ref="formDesignRef" :height="600" />

    <p @click="previewEvent">点击预览</p>

    <VxeFormView v-model="formDesignFormData" :config="formDesignConfig" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VxeFormDesignInstance, VxeFormDesignDefines } from '../../../types'

const formDesignRef = ref<VxeFormDesignInstance>()

const formDesignFormData = ref({})
const formDesignConfig = ref<VxeFormDesignDefines.FormDesignConfig>({})

const previewEvent = () => {
  const $formDesign = formDesignRef.value
  if ($formDesign) {
    formDesignConfig.value = $formDesign.getConfig()
  }
}
</script>

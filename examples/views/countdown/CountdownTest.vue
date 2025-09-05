<template>
  <div>
    <p>
      <vxe-countdown v-model="val1">
        <template #default="{ diffConf }">
          <span>{{ diffConf.HH }}</span>
          <span>：</span>
          <span>{{ diffConf.mm }}</span>
          <span>：</span>
          <span>{{ diffConf.ss }}</span>
          <span>{{ diffConf.done }}</span>
        </template>
      </vxe-countdown>
    </p>
    <p>
      <vxe-countdown v-model="val2"></vxe-countdown>
    </p>
    <p>
      <vxe-countdown v-model="val3" format="HH:mm:ss"></vxe-countdown>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref(100000)
const val2 = ref(300000)
const val3 = ref(3000000)
</script>

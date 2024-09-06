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

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      val1: 100000,
      val2: 300000,
      val3: 3000000
    }
  }
})
</script>

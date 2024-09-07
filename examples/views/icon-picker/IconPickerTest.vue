<template>
  <div>
    <p>
      <vxe-icon-picker v-model="demo1.val1"></vxe-icon-picker>
      <vxe-icon-picker v-model="demo1.val2" clearable transfer></vxe-icon-picker>
    </p>
    <p>
      <vxe-icon-picker v-model="demo1.val3" readonly></vxe-icon-picker>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      demo1: {
        val1: '',
        val2: '',
        val3: 'vxe-icon-print'
      }
    }
  }
})
</script>

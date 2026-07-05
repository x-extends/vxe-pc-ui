<template>
  <div>
    <vxe-date-range-picker v-model="val1" linkedPanels></vxe-date-range-picker>
    <vxe-date-range-picker v-model="val2" default-date="2024-09-01" :auto-close="false"></vxe-date-range-picker>
    <vxe-date-range-picker v-model="val3" default-time="10:10:30"></vxe-date-range-picker>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      val1: '',
      val2: '',
      val3: ''
    }
  }
})
</script>

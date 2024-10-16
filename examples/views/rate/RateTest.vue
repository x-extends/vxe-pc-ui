<template>
  <div>
    <vxe-rate v-model="val1"></vxe-rate>
    <vxe-rate v-model="val2"></vxe-rate>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      val1: 0,
      val2: 3
    }
  }
})
</script>

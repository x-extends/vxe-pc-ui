<template>
  <div>
    <p style="position: relative;height: 100px;">
      <vxe-loading v-model="val"></vxe-loading>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      val: true
    }
  }
})
</script>

<template>
  <div>
    <vxe-slider v-model="val1"></vxe-slider>
    <vxe-slider v-model="val3" min="20" max="180"></vxe-slider>
    <vxe-slider v-model="val2" range></vxe-slider>
    <vxe-slider v-model="val4" readonly></vxe-slider>
    <vxe-slider v-model="val5" disabled></vxe-slider>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      val1: 40,
      val2: [30, 60],
      val3: 50,
      val4: 40,
      val5: 40
    }
  }
})
</script>

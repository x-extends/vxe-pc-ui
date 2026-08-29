<template>
  <div>
    <div>{{ val1 }}</div>
    <vxe-slider v-model="val1"></vxe-slider>
    <div>{{ val3 }}</div>
    <vxe-slider v-model="val3" min="20" max="180" immediate></vxe-slider>
    <div>{{ val2 }}</div>
    <vxe-slider v-model="val2" range></vxe-slider>
    <vxe-slider v-model="val4" readonly></vxe-slider>
    <vxe-slider v-model="val5" disabled></vxe-slider>
    <div>{{ val6 }}</div>
    <vxe-slider v-model="val6" range immediate></vxe-slider>
    <div>{{ startVal7 }}，{{ endVal7 }}</div>
    <vxe-slider :startValue.sync="startVal7" :endValue.sync="endVal7" range immediate></vxe-slider>
    <div>{{ startVal8 }}，{{ endVal8 }}</div>
    <vxe-slider :startValue.sync="startVal8" :endValue.sync="endVal8" range immediate></vxe-slider>
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
      val5: 40,
      val6: null,
      startVal7: 10,
      endVal7: 20,
      startVal8: null,
      endVal8: null
    }
  }
})
</script>

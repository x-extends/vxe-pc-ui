<template>
  <div>
    <vxe-transfer v-model="selectVal1" :options="options1"></vxe-transfer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    const selectVal1: string[] = []
    const options1 = [
      { value: 11, label: '111' },
      { value: 22, label: '131' },
      { value: 33, label: '561' },
      { value: 44, label: '467' }
    ]

    return {
      selectVal1,
      options1
    }
  }
})
</script>

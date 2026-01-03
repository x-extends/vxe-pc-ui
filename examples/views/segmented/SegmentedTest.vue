<template>
  <div>
    <vxe-segmented v-model="demo1.val1" :options="demo1.opts1"></vxe-segmented>
    <vxe-segmented v-model="demo1.val1" :options="demo1.opts1" type="round"></vxe-segmented>
    <vxe-segmented v-model="demo1.val1" :options="demo1.opts1" type="inside"></vxe-segmented>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    const demo1 = {
      val1: null,
      opts1: [
        { value: '1', label: 'HTML' },
        { value: '2', label: 'CSS' },
        { value: '3', label: 'Javascriptsdf' },
        { value: '4', label: 'SASSsdf' },
        { value: '5', label: 'LESSsdf' }
      ]
    }

    return {
      demo1
    }
  }
})
</script>

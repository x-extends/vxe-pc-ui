<template>
  <div>
    <p>
      <vxe-breadcrumb>
        <vxe-breadcrumb-item>xxx</vxe-breadcrumb-item>
        <vxe-breadcrumb-item :routerLink="{ name: 'TagTest' }">xxx</vxe-breadcrumb-item>
        <vxe-breadcrumb-item>xxx</vxe-breadcrumb-item>
      </vxe-breadcrumb>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
    }
  }
})
</script>

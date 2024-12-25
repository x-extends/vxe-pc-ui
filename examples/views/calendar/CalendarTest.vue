<template>
  <div>
    <vxe-calendar @change-view="changeViewEent"></vxe-calendar>
  </div>
</template>

<script lang="ts" setup>
const changeViewEent = (params: any) => {
  console.log(params)
}
</script>

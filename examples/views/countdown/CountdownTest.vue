<template>
  <div>
    <p>
      <vxe-countdown model-value="10000">
        <template #default="{ diffConf }">
          <span>{{ diffConf.HH }}</span>
          <span>：</span>
          <span>{{ diffConf.mm }}</span>
          <span>：</span>
          <span>{{ diffConf.ss }}</span>
        </template>
      </vxe-countdown>
    </p>
    <p>
      <vxe-countdown model-value="300000"></vxe-countdown>
    </p>
    <p>
      <vxe-countdown model-value="3000000" format="HH:mm:ss"></vxe-countdown>
    </p>
  </div>
</template>

<script lang="ts" setup>
</script>

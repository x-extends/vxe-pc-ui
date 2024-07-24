<template>
  <div>
    <p>
      <vxe-tabs modelValue="3" >
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>
      </vxe-tabs>
    </p>

    <p>
      <vxe-tabs  modelValue="3" type="card">
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>
      </vxe-tabs>
    </p>

    <p>
      <vxe-tabs  modelValue="3" type="border-card" padding>
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>
      </vxe-tabs>
    </p>

    <p>
      <vxe-tabs modelValue="3" type="round-card" :height="300" show-close padding>
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>
      </vxe-tabs>
    </p>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
p {
  margin: 10px 0;
}
</style>

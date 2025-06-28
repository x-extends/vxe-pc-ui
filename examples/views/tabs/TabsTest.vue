<template>
  <div>
    <div style="margin: 10px 0;">
      <vxe-tabs modelValue1="3">
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
    <div style="margin: 10px 0;">
      <vxe-tabs modelValue1="3" position="bottom">
        <vxe-tab-pane title="xxx1xxx5 xxxxx5 xx" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxxx5 xxxxx5 xxxx5 xxxxx5 xx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxxx5 xxxx5 xxxxxxxxx5 xx5 xxxx5 xx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4xxx5 xxxxx5 xxxxx5 xx" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxx5 xx5 xxxx5 xxxx5" name="5">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
    <div style="margin: 10px 0;">
      <vxe-tabs modelValue1="3" position="left">
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
    <div style="margin: 10px 0;">
      <vxe-tabs modelValue1="3" position="right" height="300">
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx6" name="6">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx7" name="7">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx8" name="8">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx9" name="9">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>

    <div style="margin: 10px 0;">
      <vxe-tabs  modelValue="3" type="card" padding :refresh-config="{}">
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
    <div style="margin: 10px 0;">
      <vxe-tabs  modelValue="3" type="card" position="bottom" padding :refresh-config="{}">
        <vxe-tab-pane title="xxx1xxx5 xxxxx5 xx" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxxx5 xxxxx5 xxxx5 xxxxx5 xx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxxx5 xxxx5 xxxxxxxxx5 xx5 xxxx5 xx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4xxx5 xxxxx5 xxxxx5 xx" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxx5 xx5 xxxx5 xxxx5" name="5">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
    <div style="margin: 10px 0;">
      <vxe-tabs  modelValue="3" type="card" position="left" padding :refresh-config="{}">
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
    <div style="margin: 10px 0;">
      <vxe-tabs  modelValue="3" type="card" position="right" height="300" padding :refresh-config="{}">
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx6" name="6">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx7" name="7">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx8" name="8">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx9" name="9">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>

    <div style="margin: 10px 0;">
      <vxe-tabs  modelValue="3" type="border-card" padding :refresh-config="{}">
        <vxe-tab-pane title="xxxxxxxxx5 xxxx5 xxxxxxxxx5 xx5 xxxx5 x1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxxxxx5 xxxx5 xxxxxxxxx5 xx5 xxxx5 x2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxxxxx5 xxxx5 xxxxxxxxx5 xx5 xxxx5 x3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxxxx5 xxxx5 xxxxxxxxx5 xx5 xxxx5 xx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxxxx5 xxxx5 xxxxxxxxx5 xx5 xxxx5 xx5" name="5">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
    <div style="margin: 10px 0;">
      <vxe-tabs  modelValue="3" type="border-card" position="bottom" height="300" padding :refresh-config="{}">
        <vxe-tab-pane title="xxx1xxx5 xxxxx5 xx" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxxx5 xxxxx5 xxxx5 xxxxx5 xx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxxx5 xxxx5 xxxxxxxxx5 xx5 xxxx5 xx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx6" name="6">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx7" name="7">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx8" name="8">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx9" name="9">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
    <div style="margin: 10px 0;">
      <vxe-tabs  modelValue="3" type="border-card" position="left" height="300" padding :refresh-config="{}">
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx6" name="6">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx7" name="7">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx8" name="8">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx9" name="9">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
    <div style="margin: 10px 0;">
      <vxe-tabs  modelValue="3" type="border-card" position="right" height="300" padding :refresh-config="{}">
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx6" name="6">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx7" name="7">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx8" name="8">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx9" name="9">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>

    <div style="margin: 10px 0;">
      <vxe-tabs v-model="val4" type="round-card" :height="300" padding :refresh-config="{}" @tab-load="tabToadEvent">
        <vxe-tab-pane title="xxxxx" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="bbbbb" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx45f地方7999965475673" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxxf地方799994" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx3f地方79999453455" name="5">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx7" name="7">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx8" name="8">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx9" name="9">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
    <div style="margin: 10px 0;">
      <vxe-tabs v-model="val4" type="round-card" position="bottom" :height="300" padding :refresh-config="{}" @tab-load="tabToadEvent">
        <vxe-tab-pane title="xxx1xxx5 xxxxx5 xx" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxxx5 xxxxx5 xxxx5 xxxxx5 xx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxxx5 xxxx5 xxxxxxxxx5 xx5 xxxx5 xx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4xxx5 xxxxx5 xxxxx5 xx" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxxxxx5 xx5 xxxx5 xxxx5" name="5">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx7" name="7">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx8" name="8">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx9" name="9">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
    <div style="margin: 10px 0;">
      <vxe-tabs v-model="val4" type="round-card" position="left" :height="300" padding :refresh-config="{}" @tab-load="tabToadEvent">
        <vxe-tab-pane title="xxxxx" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="bbbbb" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx45f地方7999965475673" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxxf地方799994" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx3f地方79999453455" name="5">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx7" name="7">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx8" name="8">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx9" name="9">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
    <div style="margin: 10px 0;">
      <vxe-tabs v-model="val4" type="round-card" position="right" :height="300" padding :refresh-config="{}" @tab-load="tabToadEvent">
        <vxe-tab-pane title="xxxxx" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="bbbbb" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx45f地方7999965475673" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxxf地方799994" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx3f地方79999453455" name="5">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx7" name="7">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx8" name="8">ooo</vxe-tab-pane>
        <vxe-tab-pane title="xxx9" name="9">ooo</vxe-tab-pane>

        <template #prefix>
          <span>22</span>
        </template>
        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val4 = ref('3')
const tabToadEvent = (p: any) => {
  console.log(p)
}
</script>

<style lang="scss" scoped>
p {
  margin: 10px 0;
}
</style>

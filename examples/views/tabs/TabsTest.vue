<template>
  <div>
    <p>
      <vxe-tabs modelValue1="3" >
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>

        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </p>

    <p>
      <vxe-tabs  modelValue1="3" type="card">
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>

        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </p>

    <p>
      <vxe-tabs  modelValue="3" type="border-card" :refresh-config="{}" padding>
        <vxe-tab-pane title="xxx1" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxx2" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx3" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxx4" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx5" name="5">ooo</vxe-tab-pane>

        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </p>

    <p>
      <vxe-tabs v-model="val4" type="round-card" :height="300" padding :refresh-config="{}" @tab-load="tabToadEvent">
        <vxe-tab-pane title="xxxf地方799991" name="1">xxxx</vxe-tab-pane>
        <vxe-tab-pane title="xxxf地方79999f地方7999956756765657557562" name="2" icon="vxe-icon-pc">cccc</vxe-tab-pane>
        <vxe-tab-pane title="xxx45f地方7999965475673" name="3" icon="vxe-icon-pc">vvvv</vxe-tab-pane>
        <vxe-tab-pane title="xxxf地方799994" name="4">ggg</vxe-tab-pane>
        <vxe-tab-pane title="xxx3f地方79999453455" name="5">ooo</vxe-tab-pane>
        <!-- <vxe-tab-pane title="xxx345f地方79999346666" name="6">666</vxe-tab-pane>
        <vxe-tab-pane title="xxx345f地方799993777777" name="7">7777</vxe-tab-pane>
        <vxe-tab-pane title="xxx34f地方799995378888888887" name="8">8888</vxe-tab-pane>
        <vxe-tab-pane title="xxx3453dsf地方799999999999997" name="9">99999</vxe-tab-pane>
        <vxe-tab-pane title="xxx34556765765757但是风格995757575757575799999997" name="10">99999</vxe-tab-pane>
        <vxe-tab-pane title="xxx3454567655765757但是风格9946465464646999999997" name="11">99999</vxe-tab-pane>
        <vxe-tab-pane title="xxx3455435455765757但是风格99765757但是风格99353454553453543535353534999997" name="12">99999</vxe-tab-pane>
        <vxe-tab-pane title="xxx34556765765765757但是风格995757但是风格99999997" name="13">99999</vxe-tab-pane> -->

        <template #extra>
          <span>111</span>
        </template>
      </vxe-tabs>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    return {
      val4: '3'
    }
  },
  methods: {
    tabToadEvent (params: any) {
      console.log(params)
    }
  }
})
</script>

<style lang="scss" scoped>
p {
  margin: 10px 0;
}
</style>

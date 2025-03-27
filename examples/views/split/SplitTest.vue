<template>
  <div>
    <vxe-split height="200" border>
      <vxe-split-item>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-split-item>
      <vxe-split-item showAction>
        <vxe-split border vertical>
          <vxe-split-item>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-split-item>
          <vxe-split-item>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-split-item>
          <vxe-split-item>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-split-item>
        </vxe-split>
      </vxe-split-item>
    </vxe-split>

    <br>

    <vxe-split height="200" border :actionConfig="actionConfig">
      <vxe-split-item showAction>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-split-item>
      <vxe-split-item>
        <vxe-split border vertical>
          <vxe-split-item>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-split-item>
          <vxe-split-item>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-split-item>
          <vxe-split-item>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-split-item>
        </vxe-split>
      </vxe-split-item>
    </vxe-split>

    <br>

    <vxe-split height="300" border vertical>
      <vxe-split-item>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-split-item>
      <vxe-split-item showAction>
        <vxe-split border>
          <vxe-split-item>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-split-item>
          <vxe-split-item>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-split-item>
          <vxe-split-item>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-split-item>
        </vxe-split>
      </vxe-split-item>
    </vxe-split>

    <br>

    <vxe-split height="300" border vertical :actionConfig="actionConfig">
      <vxe-split-item showAction>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-split-item>
      <vxe-split-item>
        <vxe-split border>
          <vxe-split-item showAction>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-split-item>
          <vxe-split-item showAction>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-split-item>
          <vxe-split-item showAction>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-split-item>
        </vxe-split>
      </vxe-split-item>
    </vxe-split>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data () {
    const actionConfig = {
      direction: 'next'
    }
    return {
      actionConfig
    }
  }
})
</script>

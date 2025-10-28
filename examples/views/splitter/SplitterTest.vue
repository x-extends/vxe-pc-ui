<template>
  <div>
    <vxe-splitter height="200" border>
      <vxe-splitter-panel>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-splitter-panel>
      <vxe-splitter-panel showAction>
        <vxe-splitter border vertical>
          <vxe-splitter-panel>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-splitter-panel>
          <vxe-splitter-panel>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-splitter-panel>
          <vxe-splitter-panel>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-splitter-panel>
        </vxe-splitter>
      </vxe-splitter-panel>
    </vxe-splitter>

    <br>

    <vxe-splitter height="200" border :actionConfig="actionConfig">
      <vxe-splitter-panel showAction>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-splitter-panel>
      <vxe-splitter-panel>
        <vxe-splitter border vertical>
          <vxe-splitter-panel>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-splitter-panel>
          <vxe-splitter-panel>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-splitter-panel>
          <vxe-splitter-panel>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-splitter-panel>
        </vxe-splitter>
      </vxe-splitter-panel>
    </vxe-splitter>

    <br>

    <vxe-splitter height="300" border vertical>
      <vxe-splitter-panel>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-splitter-panel>
      <vxe-splitter-panel showAction>
        <vxe-splitter border>
          <vxe-splitter-panel>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-splitter-panel>
          <vxe-splitter-panel>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-splitter-panel>
          <vxe-splitter-panel>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-splitter-panel>
        </vxe-splitter>
      </vxe-splitter-panel>
    </vxe-splitter>

    <br>

    <vxe-splitter height="300" border vertical :actionConfig="actionConfig">
      <vxe-splitter-panel showAction>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-splitter-panel>
      <vxe-splitter-panel>
        <vxe-splitter border>
          <vxe-splitter-panel showAction>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-splitter-panel>
          <vxe-splitter-panel showAction>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-splitter-panel>
          <vxe-splitter-panel showAction>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-splitter-panel>
        </vxe-splitter>
      </vxe-splitter-panel>
    </vxe-splitter>
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

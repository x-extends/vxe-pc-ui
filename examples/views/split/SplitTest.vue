<template>
  <div>
    <vxe-split height="200" border>
      <vxe-split-pane>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-split-pane>
      <vxe-split-pane>
        <div style="height: 100%;background-color: #d8d8f9;">中</div>
      </vxe-split-pane>
      <vxe-split-pane showAction>
        <vxe-split border vertical>
          <vxe-split-pane>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-split-pane>
          <vxe-split-pane>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-split-pane>
          <vxe-split-pane>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-split-pane>
        </vxe-split>
      </vxe-split-pane>
    </vxe-split>

    <br>

    <vxe-split height="200" border :actionConfig="actionConfig">
      <vxe-split-pane showAction>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-split-pane>
      <vxe-split-pane>
        <div style="height: 100%;background-color: #d8d8f9;">中</div>
      </vxe-split-pane>
      <vxe-split-pane>
        <vxe-split border vertical>
          <vxe-split-pane>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-split-pane>
          <vxe-split-pane>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-split-pane>
          <vxe-split-pane>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-split-pane>
        </vxe-split>
      </vxe-split-pane>
    </vxe-split>

    <br>

    <vxe-split height="300" border vertical>
      <vxe-split-pane>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-split-pane>
      <vxe-split-pane showAction>
        <vxe-split border>
          <vxe-split-pane>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-split-pane>
          <vxe-split-pane>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-split-pane>
          <vxe-split-pane>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-split-pane>
        </vxe-split>
      </vxe-split-pane>
    </vxe-split>

    <br>

    <vxe-split height="300" border vertical :actionConfig="actionConfig">
      <vxe-split-pane showAction>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-split-pane>
      <vxe-split-pane>
        <vxe-split border>
          <vxe-split-pane showAction>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-split-pane>
          <vxe-split-pane showAction>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-split-pane>
          <vxe-split-pane showAction>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-split-pane>
        </vxe-split>
      </vxe-split-pane>
    </vxe-split>
  </div>
</template>

<script lang="ts" setup>
const actionConfig = {
  direction: 'next'
}
</script>

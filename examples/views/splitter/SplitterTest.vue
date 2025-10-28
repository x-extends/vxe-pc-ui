<template>
  <div>
    <vxe-button @click="splitterRef1.setItemExpand('1', false)">111</vxe-button>
    <vxe-button @click="splitterRef1.setItemExpand('1', true)">222</vxe-button>
    <vxe-button @click="splitterRef1.setItemExpand('2', false)">333</vxe-button>
    <vxe-button @click="splitterRef1.setItemExpand('2', true)">444</vxe-button>
    <vxe-button @click="splitterRef1.toggleItemExpand('1')">555</vxe-button>
    <vxe-button @click="splitterRef1.toggleItemExpand('2')">666</vxe-button>

    <vxe-splitter ref="splitterRef1" height="200" border :actionConfig="actionConfig">
      <vxe-splitter-panel name="1">
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-splitter-panel>
      <!-- <vxe-splitter-panel>
        <div style="height: 100%;background-color: #d8d8f9;">中</div>
      </vxe-splitter-panel> -->
      <vxe-splitter-panel name="2">
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
      <vxe-splitter-panel>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-splitter-panel>
      <!-- <vxe-splitter-panel>
        <div style="height: 100%;background-color: #d8d8f9;">中</div>
      </vxe-splitter-panel> -->
      <vxe-splitter-panel>
        <vxe-splitter border vertical :actionConfig="actionConfig">
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
      <vxe-splitter-panel>
        <vxe-splitter border :actionConfig="actionConfig">
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
      <vxe-splitter-panel>
        <div style="height: 100%;background-color: #d8d8f9;">左侧</div>
      </vxe-splitter-panel>
      <vxe-splitter-panel>
        <vxe-split border>
          <vxe-splitter-panel>
            <div style="height: 100%;background-color: #f3e1e1;">顶部</div>
          </vxe-splitter-panel>
          <vxe-splitter-panel>
            <div style="height: 100%;background-color: #e2f9d8;">中</div>
          </vxe-splitter-panel>
          <vxe-splitter-panel>
            <div style="height: 100%;background-color: #d8d8f9;">底部</div>
          </vxe-splitter-panel>
        </vxe-split>
      </vxe-splitter-panel>
    </vxe-splitter>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VxeSplitterInstance } from '../../../types'

const actionConfig = {
  showPrevButton: true,
  showNextButton: true
}

const splitterRef1 = ref<VxeSplitterInstance>()
</script>

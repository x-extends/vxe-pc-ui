<template>
  <div>
    <div class="page-wrapper">
      <vxe-layout-container vertical>
        <vxe-layout-header class="bg1">
          <div>头部</div>
        </vxe-layout-header>
        <vxe-layout-body class="bg3">
          <div>内容</div>
          <div>内容</div>
          <div>内容</div>
          <div>内容</div>
          <div>内容</div>
        </vxe-layout-body>
        <vxe-layout-footer class="bg4">
          <div>底部</div>
        </vxe-layout-footer>
      </vxe-layout-container>
    </div>

    <div class="page-wrapper">
      <vxe-layout-container vertical>
        <vxe-layout-header fixed class="bg1">
          <div>头部</div>
        </vxe-layout-header>
        <vxe-layout-body class="bg3">
          <div>内容</div>
          <div>内容</div>
          <div>内容</div>
          <div>内容</div>
          <div>内容</div>
        </vxe-layout-body>
        <vxe-layout-footer fixed class="bg4">
          <div>底部</div>
        </vxe-layout-footer>
      </vxe-layout-container>
    </div>

    <div class="page-wrapper">
      <vxe-layout-container>
        <vxe-layout-aside class="bg2">
          <div>左侧</div>
          <div>左侧</div>
          <div>左侧</div>
          <div>左侧</div>
          <div>左侧</div>
        </vxe-layout-aside>
        <vxe-layout-container vertical>
          <vxe-layout-body class="bg3">
            <div>内容</div>
            <div>内容</div>
            <div>内容</div>
            <div>内容</div>
            <div>内容</div>
          </vxe-layout-body>
        </vxe-layout-container>
      </vxe-layout-container>
    </div>

    <div class="page-wrapper">
      <vxe-layout-container vertical>
        <vxe-layout-header class="bg1">
          <div>头部</div>
        </vxe-layout-header>
        <vxe-layout-container>
          <vxe-layout-aside class="bg2">
            <div>左侧</div>
            <div>左侧</div>
            <div>左侧</div>
            <div>左侧</div>
            <div>左侧</div>
          </vxe-layout-aside>
          <vxe-layout-container vertical>
            <vxe-layout-body class="bg3">
              <div>内容</div>
              <div>内容</div>
              <div>内容</div>
              <div>内容</div>
              <div>内容</div>
            </vxe-layout-body>
          </vxe-layout-container>
        </vxe-layout-container>
      </vxe-layout-container>
    </div>

    <div class="page-wrapper">
      <vxe-layout-container vertical>
        <vxe-layout-header class="bg1">
          <div>头部</div>
        </vxe-layout-header>
        <vxe-layout-container>
          <vxe-layout-aside class="bg2">
            <div>左侧</div>
            <div>左侧</div>
            <div>左侧</div>
            <div>左侧</div>
            <div>左侧</div>
          </vxe-layout-aside>
          <vxe-layout-container vertical>
            <vxe-layout-body class="bg3">
              <div>内容</div>
              <div>内容</div>
              <div>内容</div>
              <div>内容</div>
              <div>内容</div>
            </vxe-layout-body>
            <vxe-layout-footer class="bg4">
              <div>底部</div>
            </vxe-layout-footer>
          </vxe-layout-container>
        </vxe-layout-container>
      </vxe-layout-container>
    </div>

    <div class="page-wrapper">
      <vxe-layout-container>
        <vxe-layout-aside class="bg2">
          <div>左侧</div>
          <div>左侧</div>
          <div>左侧</div>
          <div>左侧</div>
          <div>左侧</div>
        </vxe-layout-aside>
        <vxe-layout-container vertical>
          <vxe-layout-header fixed class="bg1">
            <div>头部</div>
          </vxe-layout-header>
          <vxe-layout-body class="bg3">
            <div>内容</div>
            <div>内容</div>
            <div>内容</div>
            <div>内容</div>
            <div>内容</div>
          </vxe-layout-body>
          <vxe-layout-footer fixed class="bg4">
            <div>底部</div>
          </vxe-layout-footer>
        </vxe-layout-container>
      </vxe-layout-container>
    </div>
  </div>
</template>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.page-wrapper {
  position: relative;
  height: 100px;
  margin: 20px 0;
}
.bg1 {
  background-color: #a6c9ed;
}
.bg2 {
  background-color: #c0dcf7;
}
.bg3 {
  background-color: #dfedfb;
}
.bg4 {
  background-color: #a6c9ed;
}
</style>

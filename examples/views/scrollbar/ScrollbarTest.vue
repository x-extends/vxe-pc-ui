<template>
  <div>
      <vxe-scrollbar height="20vh" @scroll="scrollEvent" @scroll-boundary="scrollBoundaryEvent">
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div style="height:200px">1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
      </vxe-scrollbar>

      <vxe-scrollbar height="20vh" native>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div style="height:200px">1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
        <div>1111</div>
      </vxe-scrollbar>
  </div>
</template>

<script lang="ts" setup>
const scrollEvent = (e: any) => {
  console.log(1111, {
    direction: e.direction,
    isTop: e.isTop,
    isBottom: e.isBottom,
    isLeft: e.isLeft,
    isRight: e.isRight
  })
}

const scrollBoundaryEvent = (e: any) => {
  console.log(2222, {
    direction: e.direction,
    isTop: e.isTop,
    isBottom: e.isBottom,
    isLeft: e.isLeft,
    isRight: e.isRight
  })
}
</script>

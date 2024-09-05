<template>
  <div>
    <vxe-button @click="printEvent1">打印1</vxe-button>
    <vxe-button @click="printEvent2">打印2</vxe-button>
    <vxe-button @click="printEvent3">打印3</vxe-button>
    <vxe-print ref="printRef" title="xxx" showPageNumber>
      <vxe-print-page-break>
        <div>sdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfs33dfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div style="height:400px">sdfsfs5dfsf</div>
        <div>sdfsfsdfsf</div>
        <div>6666666666666666666</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfs222fsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsd222fsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsf</div>
        <div>sdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsfsdfsf</div>
      </vxe-print-page-break>
      <vxe-print-page-break>345345</vxe-print-page-break>
    </vxe-print>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { VxeUI } from '../../../packages'

export default Vue.extend({
  methods: {
    printEvent1 () {
      const $print = this.$refs.printRef as any
      if ($print) {
        $print.print()
      }
    },
    printEvent2  () {
      VxeUI.print({
        title: 'fgh',
        content: '<div style="height:200px">sdfsdf</div><div style="height:200px">sdfsdf</div><div style="height:200px">sdfsdf</div><div style="height:200px">sdfsdf</div><div style="height:200px">sdfsdf</div>'
      })
    },
    printEvent3 () {
      VxeUI.print({
        title: 'sdfg',
        pageBreaks: [
          {
            bodyHtml () {
              return 'sdfsdff'
            }
          }
        ]
      })
    }
  }
})
</script>

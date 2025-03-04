<template>
  <div>
    <vxe-color-picker v-model="val1" clearable readonly></vxe-color-picker>
    <vxe-color-picker v-model="val2" show-alpha clearable></vxe-color-picker>
    <vxe-color-picker v-model="val3" type="rgb" show-alpha clearable></vxe-color-picker>
    <vxe-color-picker v-model="val4" clearable :colors="list1"></vxe-color-picker>
    <vxe-color-picker v-model="val5" clearable :colors="list1" showEyeDropper></vxe-color-picker>
    <vxe-color-picker v-model="val6" type="rgb" show-alpha clearable :colors="list2" showEyeDropper></vxe-color-picker>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const val1 = ref('rgba(220, 20, 60, 0.7)')
const val2 = ref('')
const val3 = ref('rgba(220, 20, 60, 0.7)')
const val4 = ref('')
const val5 = ref('#409eff')
const val6 = ref('#BFBFBF')

const list1 = ref([
  '#DC143C', '#FF1493', '#FF00FF', '#9932CC', '#6A5ACD',
  '#0000FF', '#00008B', '#778899', '#1E90FF', '#00BFFF',
  '#5F9EA0', '#00FFFF', '#008080', '#7FFFAA', '#3CB371',
  '#8FBC8F', '#008000', '#7CFC00', '#556B2F', '#FFFFE0',
  '#FFFF00', '#808000', '#EEE8AA', '#FFD700', '#FFA500',
  '#FF4500', '#FA8072', '#FF0000', '#800000', '#C0C0C0',
  '#808080', '#000000'
])
const list2 = ref([
  'rgb(220,20,60)', 'rgb(255,20,147)', 'rgb(255,0,255)', 'rgb(153, 50, 204)', 'rgb(106,90,205)',
  'rgb(0,0,255)', 'rgb(0,0,139)', 'rgb(119,136,153)', 'rgb(30,144,255)', 'rgb(0,191,255)',
  'rgb(95,158,160)', 'rgb(0,255,255)', 'rgb(0,128,128)', 'rgb(127,255,170)', 'rgb(60,179,113)',
  'rgb(143,188,143)', 'rgb(0,128,0)', 'rgb(124,252,0)', 'rgb(85,107,47)', 'rgb(255,255,224)',
  'rgb(255,255,0)', 'rgb(128,128,0)', 'rgb(238,232,170)', 'rgb(255,215,0)', 'rgb(255,165,0)',
  'rgb(255,69,0)', 'rgb(250,128,114)', 'rgb(255,0,0)', 'rgb(128,0,0)', 'rgb(192,192,192)',
  'rgb(128,128,128)', 'rgb(0,0,0)'
])
</script>

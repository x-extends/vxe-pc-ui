<template>
  <div style="display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;">
    <div style="width: 100%;">默认风格：
      <vxe-tag>常用写法</vxe-tag>
      <vxe-tag content="自定义颜色" color="#45adbe"/>
      <vxe-tag content="主色" color="primary" size="mini"/>
      <vxe-tag content="警告色" color="warning" size="small" icon="vxe-icon-warning-circle"/>
      <vxe-tag content="错误色" color="error" size="large"/>
      <vxe-tag round>round</vxe-tag>
      <vxe-tag closable>closable</vxe-tag>
    </div>
    <div style="width: 100%;">框线风格：
      <vxe-tag tag-style="outline">常用写法</vxe-tag>
      <vxe-tag tag-style="outline" content="自定义颜色" color="#45adbe"/>
      <vxe-tag tag-style="outline" content="主色" color="primary" size="mini"/>
      <vxe-tag tag-style="outline" content="警告色" color="warning" size="small" icon="vxe-icon-warning-circle"/>
      <vxe-tag tag-style="outline" content="错误色" color="error" size="large"/>
      <vxe-tag tag-style="outline" round>round</vxe-tag>
      <vxe-tag tag-style="outline" closable>closable</vxe-tag>
    </div>
    <div style="width: 100%;">虚线风格：
      <vxe-tag tag-style="dashed" content="自定义颜色" color="#45adbe"/>
      <vxe-tag tag-style="dashed" content="主色" color="primary" size="mini"/>
      <vxe-tag tag-style="dashed" content="警告色" color="warning" size="small" icon="vxe-icon-warning-circle"/>
      <vxe-tag tag-style="dashed" content="错误色" color="error" size="large"/>
      <vxe-tag tag-style="dashed" round>round</vxe-tag>
      <vxe-tag tag-style="dashed" closable>closable</vxe-tag>
    </div>
    <div style="width: 100%;">标记风格：
      <vxe-tag tag-style="mark">常用写法</vxe-tag>
      <vxe-tag tag-style="mark" content="自定义颜色" color="#45adbe"/>
      <vxe-tag tag-style="mark" content="主色" color="primary" size="mini"/>
      <vxe-tag tag-style="mark" content="警告色" color="warning" size="small" icon="vxe-icon-warning-circle"/>
      <vxe-tag tag-style="mark" content="错误色" color="error" size="large"/>
      <vxe-tag tag-style="mark" round>round</vxe-tag>
      <vxe-tag tag-style="mark" closable>closable</vxe-tag>
    </div>
    <div style="width: 100%;">箭头风格：
      <vxe-tag tag-style="arrow">常用写法</vxe-tag>
      <vxe-tag tag-style="arrow" content="自定义颜色" color="#45adbe"/>
      <vxe-tag tag-style="arrow" content="主色" color="primary" size="mini"/>
      <vxe-tag tag-style="arrow" content="警告色" color="warning" size="small" icon="vxe-icon-warning-circle"/>
      <vxe-tag tag-style="arrow" content="错误色" color="error" size="large"/>
      <vxe-tag tag-style="arrow" round>round</vxe-tag>
      <vxe-tag tag-style="arrow" closable>closable</vxe-tag>
    </div>
    <div style="width: 100%;">旗帜风格：
      <vxe-tag tag-style="flag">常用写法</vxe-tag>
      <vxe-tag tag-style="flag" v-model:content="str" editable color="#45adbe"/>
      <vxe-tag tag-style="flag" content="主色" color="primary" size="mini"/>
      <vxe-tag tag-style="flag" content="警告色" color="warning" size="small" icon="vxe-icon-warning-circle"/>
      <vxe-tag tag-style="flag" content="错误色" color="error" size="large"/>
      <vxe-tag tag-style="flag" round>round</vxe-tag>
      <vxe-tag tag-style="flag" closable>closable</vxe-tag>
    </div>
    <div style="width: 100%;">
      <span> 简单标签组：</span>
      <vxe-tags tag-style="mark" v-model="tagStrList"/>
    </div>
    <div style="width: 100%;">
      <span> 可编辑添加标签组：</span>
      <vxe-tags tag-style="mark" v-model="tagPropList" creator/>
      <span> 自定义创建方法标签组：</span>
      <vxe-tags tag-style="mark" v-model="tagPropList1" :creator="()=>({
        tagStyle: 'flag',
        content: '?'
      })"/>
      <span> 自定义分隔符插槽标签组：</span>
      <vxe-tags tag-style="mark" v-model="tagStrList" :creator="(tags:any[])=>clone(tags[tags?.length-1])">
        <template #separator>
          <span>    |    </span>
        </template>
      </vxe-tags>
    </div>
  </div>
</template>
<script setup lang="ts" name="TagTest">
import { ref } from 'vue'
import { VxeTagProps } from '../../../types'
import { clone } from 'xe-utils'
const str = ref('')
const tagStrList = ref(['x', 'y', 'z'])
const tagPropList = ref<VxeTagProps[]>([
  {
    tagStyle: 'mark',
    content: 'A'
  },
  {
    tagStyle: 'flag',
    content: 'B',
    color: 'primary'
  },
  {
    tagStyle: 'arrow',
    content: 'C',
    color: '#b074d2'
  }
])
const tagPropList1 = ref<VxeTagProps[]>([
  {
    tagStyle: 'mark',
    content: 'A',
    closable: true
  },
  {
    tagStyle: 'flag',
    content: 'B',
    color: 'primary'
  },
  {
    tagStyle: 'arrow',
    content: 'C',
    color: '#b074d2'
  }
])
</script>

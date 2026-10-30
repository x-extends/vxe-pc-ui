<template>
  <div class="timeline-demo">
    <!-- ==================== 配置式（options） ==================== -->
    <h3 class="demo-group-title">配置式（options）</h3>

    <!-- demo1：基础（默认垂直，默认 optionProps） -->
    <div class="demo-block">
      <div class="demo-title">demo1 · 基础（默认垂直）</div>
      <vxe-timeline :options="demo1.optList" />
    </div>

    <!-- demo2：reverse 反转 -->
    <div class="demo-block">
      <div class="demo-title">demo2 · reverse 反转顺序</div>
      <vxe-timeline :options="demo2.optList" :reverse="demo2.reverse" />
      <div class="demo-ops">
        <vxe-button @click="demo2.reverse = !demo2.reverse">
          {{ demo2.reverse ? '恢复正序' : '反转顺序' }}
        </vxe-button>
      </div>
    </div>

    <!-- demo3：横向 vertical=false -->
    <div class="demo-block">
      <div class="demo-title">demo3 · 横向（vertical=false）</div>
      <vxe-timeline :options="demo3.optList" :vertical="demo3.vertical" />
      <div class="demo-ops">
        <vxe-button @click="demo3.vertical = !demo3.vertical">
          切换 {{ demo3.vertical ? '横向' : '垂直' }}
        </vxe-button>
      </div>
    </div>

    <!-- demo4：optionProps 自定义字段名 -->
    <div class="demo-block">
      <div class="demo-title">demo4 · optionProps 自定义字段（name / desc）</div>
      <vxe-timeline
        :options="demo4.optList"
        :option-props="demo4.optionProps"
      />
    </div>

    <!-- demo5：size 尺寸 -->
    <div class="demo-block">
      <div class="demo-title">demo5 · size 尺寸（size={{ demo5.size }}）</div>
      <vxe-timeline :options="demo5.optList" :size="demo5.size" />
      <div class="demo-ops">
        <vxe-button @click="demo5.size = 'small'">small</vxe-button>
        <vxe-button @click="demo5.size = 'medium'">medium</vxe-button>
        <vxe-button @click="demo5.size = 'large'">large</vxe-button>
      </div>
    </div>

    <!-- demo6：插槽 title / content -->
    <div class="demo-block">
      <div class="demo-title">demo6 · 插槽 title / content</div>
      <vxe-timeline :options="demo6.optList">
        <template #title="{ item }">
          <span class="demo-slot-title">{{ item.title }}</span>
        </template>
        <template #content="{ item }">
          <span class="demo-slot-content">{{ item.content }}</span>
        </template>
      </vxe-timeline>
    </div>

    <!-- demo7：全部参数组合 -->
    <div class="demo-block">
      <div class="demo-title">demo7 · 全部参数组合（reverse + horizontal + size + optionProps）</div>
      <vxe-timeline
        :options="demo7.optList"
        :reverse="demo7.reverse"
        :vertical="demo7.vertical"
        :size="demo7.size"
        :option-props="demo7.optionProps"
      />
      <div class="demo-ops">
        <vxe-button @click="demo7.reverse = !demo7.reverse">
          reverse: {{ demo7.reverse }}
        </vxe-button>
        <vxe-button @click="demo7.vertical = !demo7.vertical">
          vertical: {{ demo7.vertical }}
        </vxe-button>
        <vxe-button @click="demo7.size = 'small'">small</vxe-button>
        <vxe-button @click="demo7.size = 'medium'">medium</vxe-button>
        <vxe-button @click="demo7.size = 'large'">large</vxe-button>
      </div>
    </div>

    <!-- ==================== 标签式（timeline-item） ==================== -->
    <h3 class="demo-group-title">标签式（vxe-timeline-item）</h3>

    <!-- demo8：基础 -->
    <div class="demo-block">
      <div class="demo-title">demo8 · 标签式基础</div>
      <vxe-timeline>
        <vxe-timeline-item
          v-for="(item, index) in demo8.optList"
          :key="index"
          :title="item.title"
          :content="item.content"
        />
      </vxe-timeline>
    </div>

    <!-- demo9：reverse 反转 -->
    <div class="demo-block">
      <div class="demo-title">demo9 · 标签式 reverse</div>
      <vxe-timeline :reverse="demo9.reverse">
        <vxe-timeline-item
          v-for="(item, index) in demo9.optList"
          :key="index"
          :title="item.title"
          :content="item.content"
        />
      </vxe-timeline>
      <div class="demo-ops">
        <vxe-button @click="demo9.reverse = !demo9.reverse">
          {{ demo9.reverse ? '恢复正序' : '反转顺序' }}
        </vxe-button>
      </div>
    </div>

    <!-- demo10：横向 -->
    <div class="demo-block">
      <div class="demo-title">demo10 · 标签式横向</div>
      <vxe-timeline :vertical="demo10.vertical">
        <vxe-timeline-item
          v-for="(item, index) in demo10.optList"
          :key="index"
          :title="item.title"
          :content="item.content"
        />
      </vxe-timeline>
      <div class="demo-ops">
        <vxe-button @click="demo10.vertical = !demo10.vertical">
          切换 {{ demo10.vertical ? '横向' : '垂直' }}
        </vxe-button>
      </div>
    </div>

    <!-- demo11：size 尺寸 -->
    <div class="demo-block">
      <div class="demo-title">demo11 · 标签式 size（size={{ demo11.size }}）</div>
      <vxe-timeline :size="demo11.size">
        <vxe-timeline-item
          v-for="(item, index) in demo11.optList"
          :key="index"
          :title="item.title"
          :content="item.content"
        />
      </vxe-timeline>
      <div class="demo-ops">
        <vxe-button @click="demo11.size = 'small'">small</vxe-button>
        <vxe-button @click="demo11.size = 'medium'">medium</vxe-button>
        <vxe-button @click="demo11.size = 'large'">large</vxe-button>
      </div>
    </div>

    <!-- demo12：全部参数组合 -->
    <div class="demo-block">
      <div class="demo-title">demo12 · 标签式全部参数组合</div>
      <vxe-timeline
        :reverse="demo12.reverse"
        :vertical="demo12.vertical"
        :size="demo12.size"
      >
        <vxe-timeline-item
          v-for="(item, index) in demo12.optList"
          :key="index"
          :title="item.title"
          :content="item.content"
        />
      </vxe-timeline>
      <div class="demo-ops">
        <vxe-button @click="demo12.reverse = !demo12.reverse">
          reverse: {{ demo12.reverse }}
        </vxe-button>
        <vxe-button @click="demo12.vertical = !demo12.vertical">
          vertical: {{ demo12.vertical }}
        </vxe-button>
        <vxe-button @click="demo12.size = 'small'">small</vxe-button>
        <vxe-button @click="demo12.size = 'medium'">medium</vxe-button>
        <vxe-button @click="demo12.size = 'large'">large</vxe-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

/* ==================== 配置式 ==================== */

// demo1：基础
const demo1 = reactive({
  optList: [
    { title: '2024-01-01', content: '项目立项，需求评审' },
    { title: '2024-02-15', content: '完成第一版开发' },
    { title: '2024-03-20', content: '测试通过，准备上线' },
    { title: '2024-04-01', content: '正式发布 v1.0' }
  ]
})

// demo2：reverse
const demo2 = reactive({
  reverse: false,
  optList: [
    { title: '2024-01-01', content: '项目立项，需求评审' },
    { title: '2024-02-15', content: '完成第一版开发' },
    { title: '2024-03-20', content: '测试通过，准备上线' },
    { title: '2024-04-01', content: '正式发布 v1.0' }
  ]
})

// demo3：横向
const demo3 = reactive({
  vertical: false,
  optList: [
    { title: '需求', content: '收集并确认需求' },
    { title: '设计', content: '完成交互与视觉' },
    { title: '开发', content: '编码与联调' },
    { title: '测试', content: '功能与回归测试' },
    { title: '上线', content: '发布正式版本' }
  ]
})

// demo4：optionProps 自定义字段名
const demo4 = reactive({
  optionProps: {
    title: 'name',
    content: 'desc'
  },
  optList: [
    { name: '2024-01-01', desc: '项目立项，需求评审' },
    { name: '2024-02-15', desc: '完成第一版开发' },
    { name: '2024-03-20', desc: '测试通过，准备上线' }
  ]
})

// demo5：size
const demo5 = reactive({
  size: 'medium' as 'small' | 'medium' | 'large',
  optList: [
    { title: '2024-01-01', content: '项目立项，需求评审' },
    { title: '2024-02-15', content: '完成第一版开发' },
    { title: '2024-03-20', content: '测试通过，准备上线' }
  ]
})

// demo6：插槽
const demo6 = reactive({
  optList: [
    { title: '2024-01-01', content: '项目立项，需求评审' },
    { title: '2024-02-15', content: '完成第一版开发' },
    { title: '2024-03-20', content: '测试通过，准备上线' }
  ]
})

// demo7：全部参数组合
const demo7 = reactive({
  reverse: false,
  vertical: true,
  size: 'medium' as 'small' | 'medium' | 'large',
  optionProps: {
    title: 'date',
    content: 'text'
  },
  optList: [
    { date: '2024-01-01', text: '项目立项，需求评审' },
    { date: '2024-02-15', text: '完成第一版开发' },
    { date: '2024-03-20', text: '测试通过，准备上线' },
    { date: '2024-04-01', text: '正式发布 v1.0' }
  ]
})

/* ==================== 标签式 ==================== */

// demo8：基础
const demo8 = reactive({
  optList: [
    { title: '2024-01-01', content: '项目立项，需求评审' },
    { title: '2024-02-15', content: '完成第一版开发' },
    { title: '2024-03-20', content: '测试通过，准备上线' },
    { title: '2024-04-01', content: '正式发布 v1.0' }
  ]
})

// demo9：reverse
const demo9 = reactive({
  reverse: false,
  optList: [
    { title: '2024-01-01', content: '项目立项，需求评审' },
    { title: '2024-02-15', content: '完成第一版开发' },
    { title: '2024-03-20', content: '测试通过，准备上线' },
    { title: '2024-04-01', content: '正式发布 v1.0' }
  ]
})

// demo10：横向
const demo10 = reactive({
  vertical: false,
  optList: [
    { title: '需求', content: '收集并确认需求' },
    { title: '设计', content: '完成交互与视觉' },
    { title: '开发', content: '编码与联调' },
    { title: '测试', content: '功能与回归测试' },
    { title: '上线', content: '发布正式版本' }
  ]
})

// demo11：size
const demo11 = reactive({
  size: 'medium' as 'small' | 'medium' | 'large',
  optList: [
    { title: '2024-01-01', content: '项目立项，需求评审' },
    { title: '2024-02-15', content: '完成第一版开发' },
    { title: '2024-03-20', content: '测试通过，准备上线' }
  ]
})

// demo12：全部参数组合
const demo12 = reactive({
  reverse: false,
  vertical: true,
  size: 'medium' as 'small' | 'medium' | 'large',
  optList: [
    { title: '2024-01-01', content: '项目立项，需求评审' },
    { title: '2024-02-15', content: '完成第一版开发' },
    { title: '2024-03-20', content: '测试通过，准备上线' },
    { title: '2024-04-01', content: '正式发布 v1.0' }
  ]
})
</script>

<style lang="scss" scoped>
.timeline-demo {

  .demo-group-title {
    margin: 24px 0 16px;
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    border-left: 4px solid #409eff;
    padding-left: 8px;

    &:first-child {
      margin-top: 0;
    }
  }

  .demo-block {
    margin-bottom: 32px;
    padding: 16px;
    background-color: #fff;
    border: 1px solid #ebeef5;
    border-radius: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .demo-title {
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;
    color: #606266;
  }

  .demo-ops {
    margin-top: 16px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .demo-slot-title {
    color: #409eff;
    font-weight: 600;
  }

  .demo-slot-content {
    color: #909399;
    font-style: italic;
  }
}
</style>

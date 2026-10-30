<template>
  <div class="demo-container">

    <!-- ========== 一、进度驱动（v-model + showSeq / showIcon） ========== -->

    <div class="demo-block">
      <div class="demo-title">demo1：默认小圆点 + v-model 进度</div>
      <div class="demo-toolbar">
        <button @click="demo1.current = Math.max(0, demo1.current - 1)">上一步</button>
        <button @click="demo1.current = Math.min(demo1.options.length - 1, demo1.current + 1)">下一步</button>
        <span>current = {{ demo1.current }}</span>
      </div>
      <vxe-steps v-model="demo1.current" :options="demo1.options"></vxe-steps>
    </div>

    <div class="demo-block">
      <div class="demo-title">demo2：showSeq 序号 + v-model 进度</div>
      <div class="demo-toolbar">
        <button @click="demo2.current = Math.max(0, demo2.current - 1)">上一步</button>
        <button @click="demo2.current = Math.min(demo2.options.length - 1, demo2.current + 1)">下一步</button>
        <span>current = {{ demo2.current }}</span>
      </div>
      <vxe-steps v-model="demo2.current" show-seq :options="demo2.options"></vxe-steps>
    </div>

    <div class="demo-block">
      <div class="demo-title">demo3：showSeq + showIcon（finish ✓ / error ✕）</div>
      <div class="demo-toolbar">
        <button @click="demo3.current = Math.max(0, demo3.current - 1)">上一步</button>
        <button @click="demo3.current = Math.min(demo3.options.length - 1, demo3.current + 1)">下一步</button>
        <span>current = {{ demo3.current }}</span>
      </div>
      <vxe-steps v-model="demo3.current" show-seq show-icon :options="demo3.options"></vxe-steps>
    </div>

    <!-- ========== 二、自定义状态（status 覆盖推导） ========== -->

    <div class="demo-block">
      <div class="demo-title">demo4：自定义 status（小圆点模式）</div>
      <vxe-steps :options="demo4.options"></vxe-steps>
    </div>

    <div class="demo-block">
      <div class="demo-title">demo5：自定义 status（showSeq + showIcon）</div>
      <vxe-steps show-seq show-icon :options="demo5.options"></vxe-steps>
    </div>

    <!-- ========== 三、尺寸 ========== -->

    <div class="demo-block">
      <div class="demo-title">demo6：尺寸 size（showSeq 模式）</div>
      <div v-for="item in demo6.sizeList" :key="item.size" class="demo-sub">
        <div class="demo-label">size = {{ item.size }}</div>
        <vxe-steps :size="item.size" v-model="demo6.current" show-seq :options="demo6.options"></vxe-steps>
      </div>
    </div>

    <!-- ========== 四、纵向 ========== -->

    <div class="demo-block">
      <div class="demo-title">demo7：纵向 vertical（小圆点）</div>
      <vxe-steps v-model="demo7.current" vertical :options="demo7.options"></vxe-steps>
    </div>

    <div class="demo-block">
      <div class="demo-title">demo8：纵向 vertical（showSeq + showIcon）</div>
      <vxe-steps v-model="demo8.current" vertical show-seq show-icon :options="demo8.options"></vxe-steps>
    </div>

    <!-- ========== 五、simple 面包屑 + separator ========== -->

    <div class="demo-block">
      <div class="demo-title">demo9：simple + 默认分隔符</div>
      <vxe-steps type="simple" :options="demo9.options"></vxe-steps>
    </div>

    <div class="demo-block">
      <div class="demo-title">demo10：simple + 自定义 separator</div>
      <vxe-steps type="simple" separator="→" :options="demo10.options"></vxe-steps>
    </div>

    <div class="demo-block">
      <div class="demo-title">demo11：simple + separator 插槽</div>
      <vxe-steps type="simple" :options="demo11.options">
        <template #separator>
          <span style="color: #909399;">xx</span>
        </template>
      </vxe-steps>
    </div>

    <div class="demo-block">
      <div class="demo-title">demo12：simple + vertical</div>
      <vxe-steps type="simple" vertical :options="demo12.options"></vxe-steps>
    </div>

    <!-- ========== 六、optionProps 字段映射 ========== -->

    <div class="demo-block">
      <div class="demo-title">demo13：optionProps 自定义字段</div>
      <vxe-steps :option-props="demo13.optionProps" :options="demo13.options"></vxe-steps>
    </div>

    <!-- ========== 七、插槽 ========== -->

    <div class="demo-block">
      <div class="demo-title">demo14：title / content 插槽</div>
      <vxe-steps :options="demo14.options">
        <template #title="{ item }">
          <span style="color: #409eff;">★ {{ item.title }}</span>
        </template>
        <template #content="{ item }">
          <span style="color: #909399;">{{ item.content }}</span>
        </template>
      </vxe-steps>
    </div>

  </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data () {
    // ---------- v-model 进度驱动 ----------

    // demo1：默认小圆点
    const demo1 = {
      current: 1,
      options: [
        { title: '填写信息', content: '填写个人基本信息' },
        { title: '确认信息', content: '核对并确认填写内容' },
        { title: '审核', content: '等待审批' },
        { title: '完成', content: '流程结束' }
      ]
    }

    // demo2：showSeq 序号
    const demo2 = {
      current: 2,
      options: [
        { title: '基本信息', content: '填写基本信息' },
        { title: '联系方式', content: '填写联系方式' },
        { title: '身份认证', content: '上传身份证' },
        { title: '完成', content: '提交完成' }
      ]
    }

    // demo3：showSeq + showIcon
    const demo3 = {
      current: 2,
      options: [
        { title: '提交订单', content: '2024-06-01 09:00' },
        { title: '支付', content: '2024-06-01 09:05' },
        { title: '发货', content: '商家处理中' },
        { title: '签收', content: '等待收货' },
        { title: '评价', content: '待评价' }
      ]
    }

    // ---------- 自定义状态 ----------

    // demo4：小圆点模式 + 自定义 status
    const demo4 = {
      options: [
        { title: '完成', content: '已完成', status: 'finish' },
        { title: '处理中', content: '进行中', status: 'process' },
        { title: '出错', content: '校验失败', status: 'error' },
        { title: '待处理', content: '-' }
      ]
    }

    // demo5：showSeq + showIcon + 自定义 status
    const demo5 = {
      options: [
        { title: '完成', content: '已完成', status: 'finish' },
        { title: '处理中', content: '进行中', status: 'process' },
        { title: '出错', content: '校验失败', status: 'error' },
        { title: '待处理', content: '-' }
      ]
    }

    // ---------- 尺寸 ----------

    // demo6：全部尺寸（showSeq 模式）
    const demo6 = {
      current: 1,
      sizeList: [
        { size: 'xlarge' },
        { size: 'large' },
        { size: 'medium' },
        { size: 'small' },
        { size: 'mini' }
      ],
      options: [
        { title: '第一步', content: '开始' },
        { title: '第二步', content: '进行中' },
        { title: '第三步', content: '待处理' }
      ]
    }

    // ---------- 纵向 ----------

    // demo7：纵向小圆点
    const demo7 = {
      current: 1,
      options: [
        { title: '提交申请', content: '2024-01-01 09:00 提交' },
        { title: '部门审核', content: '2024-01-01 10:30 审核中' },
        { title: '财务复核', content: '等待财务处理' },
        { title: '完成打款', content: '等待打款' }
      ]
    }

    // demo8：纵向 showSeq + showIcon
    const demo8 = {
      current: 2,
      options: [
        { title: '注册账号', content: '2024-01-01 已完成' },
        { title: '实名认证', content: '2024-01-02 已完成' },
        { title: '绑定手机', content: '处理中' },
        { title: '完成', content: '待处理' }
      ]
    }

    // ---------- simple 面包屑 ----------

    // demo9：simple 默认分隔符
    const demo9 = {
      options: [
        { title: '基本信息' },
        { title: '账号安全' },
        { title: '完成' }
      ]
    }

    // demo10：simple 自定义分隔符
    const demo10 = {
      options: [
        { title: '待付款' },
        { title: '待发货' },
        { title: '待收货' },
        { title: '已完成' }
      ]
    }

    // demo11：simple + separator 插槽
    const demo11 = {
      options: [
        { title: '首页' },
        { title: '商品列表' },
        { title: '商品详情' },
        { title: '确认订单' }
      ]
    }

    // demo12：simple + vertical
    const demo12 = {
      options: [
        { title: '待付款' },
        { title: '待发货' },
        { title: '待收货' },
        { title: '已完成' }
      ]
    }

    // ---------- optionProps ----------

    // demo13：自定义字段映射
    const demo13 = {
      optionProps: {
        title: 'name',
        content: 'desc',
        status: 'state'
      },
      options: [
        { name: '创建订单', desc: '2024-05-01 10:00', state: 'finish' },
        { name: '支付订单', desc: '2024-05-01 10:05', state: 'finish' },
        { name: '商家发货', desc: '等待商家处理', state: 'process' },
        { name: '确认收货', desc: '等待买家确认' }
      ]
    }

    // ---------- 插槽 ----------

    // demo14：title / content 插槽
    const demo14 = {
      options: [
        { title: '阶段一', content: '已完成', status: 'finish' },
        { title: '阶段二', content: '进行中', status: 'process' },
        { title: '阶段三', content: '待开始' }
      ]
    }

    return {
      demo1,
      demo2,
      demo3,
      demo4,
      demo5,
      demo6,
      demo7,
      demo8,
      demo9,
      demo10,
      demo11,
      demo12,
      demo13,
      demo14
    }
  }
})
</script>

<style scoped>
.demo-container {
  padding: 16px;
}
.demo-block {
  margin-bottom: 32px;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.demo-title {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
.demo-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #606266;
}
.demo-toolbar button {
  padding: 4px 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
.demo-sub {
  margin-bottom: 16px;
}
.demo-sub:last-child {
  margin-bottom: 0;
}
.demo-label {
  margin-bottom: 6px;
  font-size: 12px;
  color: #909399;
}
</style>

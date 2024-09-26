import { CreateElement, PropType, VNode } from 'vue'
import { defineVxeComponent } from '../../ui/src/comp'
import XEUtils from 'xe-utils'
import { createEvent } from '../../ui'
import { assembleCollapseItem, destroyCollapseItem } from './util'

import type { CollapsePaneReactData, VxeCollapsePanePropTypes, VxeCollapsePaneEmits, VxeCollapsePrivateMethods, ValueOf, VxeCollapseConstructor, VxeCollapsePaneDefines } from '../../../types'

export default defineVxeComponent({
  name: 'VxeCollapsePane',
  props: {
    title: [String, Number] as PropType<VxeCollapsePanePropTypes.Title>,
    name: [String, Number] as PropType<VxeCollapsePanePropTypes.Name>,
    icon: String as PropType<VxeCollapsePanePropTypes.Icon>,
    preload: Boolean as PropType<VxeCollapsePanePropTypes.Preload>,
    permissionCode: [String, Number] as PropType<VxeCollapsePanePropTypes.PermissionCode>
  },
  inject: {
    $xeCollapse: {
      default: null
    }
  },
  data () {
    const xID = XEUtils.uniqueId()
    const reactData: CollapsePaneReactData = {
    }
    const collapseConfig: VxeCollapsePaneDefines.CollapseConfig = {
      id: xID,
      title: '',
      name: '',
      icon: '',
      preload: false,
      permissionCode: '',
      slots: {}
    }

    return {
      xID,
      reactData,
      collapseConfig
    }
  },
  computed: {
    ...({} as {
      $xeCollapse():(VxeCollapseConstructor & VxeCollapsePrivateMethods) | null
    })
  },
  methods: {
    //
    // Method
    //
    dispatchEvent (type: ValueOf<VxeCollapsePaneEmits>, params: Record<string, any>, evnt: Event | null) {
      const $xeCollapsePane = this
      $xeCollapsePane.$emit(type, createEvent(evnt, { $collapsePane: $xeCollapsePane }, params))
    },

    //
    // Render
    //
    renderVN (h: CreateElement): VNode {
      const $xeCollapsePane = this
      const slots = $xeCollapsePane.$scopedSlots

      const defaultSlot = slots.default
      return h('div', {
        ref: 'refElem',
        class: ['vxe-collapse-pane']
      }, defaultSlot ? defaultSlot({}) : [])
    }
  },
  watch: {
    title (val) {
      const $xeCollapsePane = this
      const collapseConfig = $xeCollapsePane.collapseConfig

      collapseConfig.title = val
    },
    name (val) {
      const $xeCollapsePane = this
      const collapseConfig = $xeCollapsePane.collapseConfig

      collapseConfig.name = val
    },
    icon (val) {
      const $xeCollapsePane = this
      const collapseConfig = $xeCollapsePane.collapseConfig

      collapseConfig.icon = val
    },
    permissionCode (val) {
      const $xeCollapsePane = this
      const collapseConfig = $xeCollapsePane.collapseConfig

      collapseConfig.permissionCode = val
    }
  },
  created () {
    const $xeCollapsePane = this
    const props = $xeCollapsePane
    const slots = $xeCollapsePane.$scopedSlots
    const collapseConfig = $xeCollapsePane.collapseConfig

    Object.assign(collapseConfig, {
      title: props.title,
      name: props.name,
      icon: props.icon,
      preload: props.preload,
      permissionCode: props.permissionCode,
      slots
    })
  },
  mounted () {
    const $xeCollapsePane = this
    const $xeCollapse = $xeCollapsePane.$xeCollapse
    const slots = $xeCollapsePane.$scopedSlots
    const collapseConfig = $xeCollapsePane.collapseConfig

    collapseConfig.slots = slots

    const elem = $xeCollapsePane.$refs.refElem as HTMLDivElement
    if ($xeCollapse && elem) {
      assembleCollapseItem($xeCollapse, elem, collapseConfig)
    }
  },
  beforeDestroy () {
    const $xeCollapsePane = this
    const $xeCollapse = $xeCollapsePane.$xeCollapse
    const collapseConfig = $xeCollapsePane.collapseConfig

    if ($xeCollapse) {
      destroyCollapseItem($xeCollapse, collapseConfig)
    }
  },
  render (this: any, h) {
    return this.renderVN(h)
  }
})

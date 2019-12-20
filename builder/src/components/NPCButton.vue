<template>
  <div :style="npcPos">
    <block-button :block="2" @add-object="$emit('view-npc')" />
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton.vue'
export default {
  components: {
    'block-button': BlockButton
  },
  props: {
    npc: {
      type: Object,
      required: true
    },
    blocksize: {
      type: Number,
      required: true
    }
  },
  computed: {
    npcPos() {
      let left = this.blocksize * this.npc.x || 0
      let top = this.blocksize * this.npc.y || 0
      let pos = {
        position: 'absolute',
        left: left.toString() + 'px',
        top: top.toString() + 'px',
        width: this.blocksize + 'px',
        height: this.blocksize + 'px'
      }
      return pos
    }
  }
}
</script>

<style></style>

<template>
  <div :style="npcPos">
    <block-button
      :block="block"
      :image="spritedata[npc.image]"
      @add-object="$emit('view-npc')"
      @remove-object="$emit('remove-npc')"
    />
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton.vue'
export default {
  components: {
    'block-button': BlockButton
  },
  props: {
    block: {
      type: Number,
      default: 2
    },
    spritedata: {
      type: Object,
      required: true
    },
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

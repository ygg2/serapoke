<template>
  <button
    @click="$emit('add-object')"
    @contextmenu="$emit('remove-object')"
    :style="blockStyle"
  >
    <img v-if="image" :src="image" :style="maskStyle" />
  </button>
</template>

<script>
export default {
  props: {
    block: {
      type: Number,
      default: 0
    },
    image: {
      type: String,
      default: ''
    }
  },
  computed: {
    blockStyle() {
      switch (this.block) {
        case 1:
          return { background: '#00000055' }
        case 2:
          return { background: '#00ff0055' }
        case 3:
          return { background: '#ff000077' }
      }
      return {}
    },
    maskStyle() {
      return {
        position: 'absolute',
        left: '0',
        top: '0'
      }
    }
  }
}
</script>

<style scoped>
button {
  display: block;
  width: 100%;
  height: 100%;
  outline-style: none;
  box-shadow: none;
  border-color: transparent;
}
button:hover {
  background: #8822ff55;
  outline: 1px solid #8822ff;
}
</style>

<template>
  <button @click="$emit('add-object')" :style="blockStyle" />
</template>

<script>
export default {
  props: {
    block: {
      type: Number,
      default: 0
    }
  },
  computed: {
    blockStyle() {
      switch (this.block) {
        case 1:
          return { background: '#00000055' }
        case 2:
          return { background: '#00ff0055' }
      }
      return {}
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

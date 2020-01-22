<template>
  <button
    @mousedown="addOrRemove"
    @mouseover="$emit('mouse-over')"
    :style="blockStyle"
    :class="{ coords }"
  >
    <img v-if="image" :src="image" :style="maskStyle" />
    <p v-if="coords">{{ x }}, {{ y }}</p>
  </button>
</template>

<script>
export default {
  props: {
    coords: {
      type: Boolean,
      default: false
    },
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    },
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
        bottom: '0'
      }
    }
  },
  methods: {
    addOrRemove(ev) {
      if (ev.button == 0) this.$emit('add-object')
      else if (ev.button == 2) this.$emit('remove-object')
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
button p {
  opacity: 0;
  color: white;
  text-shadow: 0 0 3px black;
}
button.coords:hover p {
  opacity: 1;
}
</style>

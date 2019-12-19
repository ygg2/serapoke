<template>
  <div class="home">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/npc">NPC</router-link>
    <img :src="spritedata[map.background]" class="top-left" />
    <div class="top-left">
      <div v-for="x of map.width" :key="x" :style="displayX">
        <div v-for="y of map.height" :key="y" :style="displayY">
          <button class="block-button" @click="addObject" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    map: {
      type: Object,
      required: true
    },
    spritedata: {
      type: Object,
      required: true
    },
    blocksize: {
      type: Number,
      default: 16
    }
  },
  data() {
    return {
      displayX: {
        display: 'inline-block',
        width: this.blocksize.toString() + 'px'
      },
      displayY: {
        display: 'block',
        height: this.blocksize.toString() + 'px'
      }
    }
  },
  methods: {
    addObject() {
      console.log('adding object')
    }
  }
}
</script>
<style scoped>
div {
  padding: 0;
  margin: 0;
}
.block-button {
  width: 100%;
  height: 100%;
}
.block-button:hover {
  background: #00ff8855;
}
</style>

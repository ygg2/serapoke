<template>
  <div class="top-left">
    <canvas id="tileCanvas">Canvas not loaded</canvas>
    <div class="top-left">
      <div v-for="(row, y) of map.map" :key="'y' + y" :style="displayY">
        <div v-for="(block, x) of row" :key="'x' + x" :style="displayX">
          <block-button @add-object="addTile(x, y)" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton.vue'
export default {
  components: {
    'block-button': BlockButton
  },
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
    },
    tileset: {
      type: String,
      required: true
    },
    placingtile: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      displayX: {
        display: 'inline-block',
        height: '100%',
        width: this.blocksize.toString() + 'px'
      },
      displayY: {
        display: 'block',
        height: this.blocksize.toString() + 'px'
      },
      tiles: new Image()
    }
  },
  mounted() {
    this.canvas = document.getElementById('tileCanvas')
    this.ctx = this.canvas.getContext('2d', { alpha: false })
    this.tiles.src = this.tileset
    this.loadMap()
  },
  watch: {
    map() {
      this.loadMap()
    },
    tileset() {
      this.tiles.src = this.tileset
    }
  },
  methods: {
    loadMap() {
      if (!this.map.nomap) {
        this.canvas.width = this.map.map[0].length * this.blocksize
        this.canvas.height = this.map.map.length * this.blocksize
        let background = new Image()
        background.src = this.spritedata[this.map.background]
        this.ctx.drawImage(background, 0, 0)
      }
    },
    // to do: save
    addTile(x, y) {
      if (this.placingtile.dx || this.placingtile.dx === 0)
        this.ctx.drawImage(
          this.tiles,
          this.placingtile.sx * this.blocksize,
          this.placingtile.sy * this.blocksize,
          this.blocksize,
          this.blocksize,
          x * this.blocksize,
          y * this.blocksize,
          this.blocksize,
          this.blocksize
        )
    }
  }
}
</script>

<style></style>

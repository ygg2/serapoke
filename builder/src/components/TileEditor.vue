<template>
  <div class="top-left">
    <canvas id="tileCanvas">Canvas not loaded</canvas>
    <div
      class="top-left"
      @mousedown.left="isAdding = true"
      @mouseup="isAdding = false"
    >
      <div v-for="(row, y) of map.map" :key="'y' + y" :style="displayY">
        <div v-for="(block, x) of row" :key="'x' + x" :style="displayX">
          <block-button
            @add-object="addTile(x, y)"
            @mouse-over="addIfDown(x, y)"
            :coords="placing == 1"
            :x="x"
            :y="y"
          />
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
    placing: {
      type: Number,
      default: 0
    },
    map: {
      type: Object,
      required: true
    },
    mapname: {
      type: String,
      required: true
    },
    tempdata: {
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
      hasBeenModified: false,
      lastMap: '',
      canvas: null,
      ctx: null,
      isAdding: false,
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
    mapname() {
      if (this.hasBeenModified) {
        this.$emit('save-temp-map', {
          name: this.lastMap,
          image: this.canvas.toDataURL('image/png')
        })
      }
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
        background.onload = () => {
          this.ctx.drawImage(background, 0, 0)
        }
        if (this.tempdata[this.mapname]) {
          background.src = this.tempdata[this.mapname]
        } else {
          background.src = this.spritedata[this.map.background]
        }
        this.lastMap = this.mapname
      } else {
        this.canvas.width = 0
        this.canvas.height = 0
      }
      this.hasBeenModified = false
    },
    // to do: save
    addTile(x, y) {
      if (this.placing == 0) {
        if (this.placingtile.dx || this.placingtile.dx === 0) {
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
        this.hasBeenModified = true
      }
    },
    addIfDown(x, y) {
      if (this.isAdding) {
        this.addTile(x, y)
      }
    }
  }
}
</script>

<style></style>

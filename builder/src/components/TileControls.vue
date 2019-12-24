<template>
  <v-container>
    <v-row no-gutters class="px-2">
      <!--
      <v-col cols="3">
        <v-text-field label="Width" type="number" dense hide-details />
      </v-col>
      <v-col cols="3" class="px-2">
        <v-text-field label="Height" type="number" dense hide-details />
      </v-col>
      -->
      <v-col>
        <v-file-input
          label="Tileset"
          :value="tileset"
          @change="emitTilesetFile"
          accept="image/*"
          prepend-icon=""
          truncate-length="10"
          :clearable="false"
          dense
        />
      </v-col>
    </v-row>
    <v-row class="px-2" no-gutters>
      <v-col>
        <v-text-field
          label="Background"
          v-model="map.background"
          dense
          hide-details
        />
      </v-col>
    </v-row>
    <v-row class="pr-2" no-gutters>
      <v-col>
        <v-subheader>Player Spawn</v-subheader>
      </v-col>
      <v-col class="pr-1">
        <number-input label="X" v-model="map.spawnx" />
      </v-col>
      <v-col class="pl-1">
        <number-input label="Y" v-model="map.spawny" />
      </v-col>
    </v-row>
    <v-row style="height:320px; overflow-y:scroll; position:relative">
      <canvas id="tilePicker" style="background-color:black" width="256" />
      <div class="top-left" style="line-height: 0">
        <div v-for="(cell, i) of tilePicker" :key="i" :style="cellStyle">
          <block-button :block="cell.block" @add-object="selectTile(i)" />
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script>
import BlockButton from '@/components/BlockButton.vue'
import NumberInput from '@/components/NumberInput.vue'
export default {
  components: {
    'block-button': BlockButton,
    'number-input': NumberInput
  },
  props: {
    map: {
      type: Object,
      required: true
    },
    tileset: {
      type: Array,
      required: true
    },
    tilesetData: {
      type: String,
      default: ''
    },
    blocksize: {
      type: Number,
      default: 16
    }
  },
  data() {
    return {
      tilePicker: []
    }
  },
  watch: {
    tilesetData() {
      let tiles = new Image()
      this.tilePicker = []
      tiles.onload = () => {
        // find width, height, and area in cells for original image
        let horizontalTiles = Math.floor(tiles.width / this.blocksize)
        let verticalTiles = Math.floor(tiles.height / this.blocksize)
        let area = horizontalTiles * verticalTiles

        // get the width and height for the canvas
        let canvasWidthInBlocks = Math.floor(this.canvas.width / this.blocksize)
        let canvasHeightInBlocks = Math.floor(area / canvasWidthInBlocks) || 1
        this.canvas.height = canvasHeightInBlocks * this.blocksize

        // set canvas css height to avoid stretching
        this.canvas.style.height = this.canvas.height.toString() + 'px'

        let x2 = 0
        let y2 = 0
        for (var y = 0; y < verticalTiles; y++) {
          for (var x = 0; x < horizontalTiles; x++) {
            this.tilePicker.push({ sx: x, sy: y, dx: x2, dy: y2, block: 0 })
            // image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight
            this.context.drawImage(
              tiles,
              x * this.blocksize,
              y * this.blocksize,
              this.blocksize,
              this.blocksize,
              x2 * this.blocksize,
              y2 * this.blocksize,
              this.blocksize,
              this.blocksize
            )
            x2++
            if (x2 >= canvasWidthInBlocks) {
              x2 = 0
              y2++
            }
          }
        }
      }
      tiles.src = this.tilesetData
    }
  },
  computed: {
    cellStyle() {
      return {
        display: 'inline-block',
        width: this.blocksize.toString() + 'px',
        height: this.blocksize.toString() + 'px'
      }
    }
  },
  mounted() {
    this.canvas = document.getElementById('tilePicker')
    this.context = this.canvas.getContext('2d', { alpha: false })
  },
  methods: {
    selectTile(index) {
      this.$emit('select-tile', this.tilePicker[index])
    },
    emitTilesetFile(file) {
      this.$emit('load-tileset', file.path)
    }
  }
}
</script>

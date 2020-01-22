<template>
  <v-container>
    <v-row class="px-2" no-gutters>
      <v-col class="pr-1">
        <number-input label="Width" :value="width" @true-update="setW" />
      </v-col>
      <v-col class="pl-1">
        <number-input label="Height" :value="height" @true-update="setH" />
      </v-col>
    </v-row>
    <v-row class="px-2" no-gutters>
      <v-col>
        <v-text-field label="Background" v-model="map.background" dense />
      </v-col>
    </v-row>
    <v-row class="pr-2" no-gutters>
      <v-col>
        <v-subheader>Player Spawn</v-subheader>
      </v-col>
      <v-col class="pr-1">
        <number-input label="X" v-model="map.spawnx" dense />
      </v-col>
      <v-col class="pl-1">
        <number-input label="Y" v-model="map.spawny" dense />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NumberInput from '@/components/NumberInput.vue'
export default {
  components: {
    'number-input': NumberInput
  },
  props: {
    map: {
      type: Object,
      required: true
    }
  },
  computed: {
    width() {
      return this.map.nomap ? 0 : this.map.map[0].length
    },
    height() {
      return this.map.nomap ? 0 : this.map.map.length
    }
  },
  methods: {
    setW(width) {
      if (!this.map.nomap) {
        // if the new size is smaller, cut entries from each row
        if (this.map.map[0].length > width) {
          for (let row of this.map.map) {
            row.splice(width)
          }
        } else {
          // get each row up to width
          for (let row of this.map.map) {
            while (row.length < width) {
              row.push(0)
            }
          }
        }
      }
    },
    setH(height) {
      if (!this.map.nomap) {
        // if the new size is smaller, cut off the last rows.
        if (this.map.map.length > height) {
          this.map.map.splice(height)
        } else {
          while (this.map.map.length < height) {
            // fill a new row, the same length as row 0, with 0s.
            let row = this.map.map[0].map(() => 0)
            this.map.map.push(row)
          }
        }
      }
    }
  }
}
</script>

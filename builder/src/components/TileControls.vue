<template>
  <v-container>
    <v-row no-gutters class="px-2">
      <v-col cols="3">
        <v-text-field label="Width" type="number" dense hide-details />
      </v-col>
      <v-col cols="3" class="px-2">
        <v-text-field label="Height" type="number" dense hide-details />
      </v-col>
      <v-col>
        <v-file-input
          label="Tileset"
          :value="tileset"
          @input="$emit('update:tileset', tileset)"
          accept="image/*"
          prepend-icon=""
          truncate-length="10"
          :clearable="false"
          dense
          hide-details
        />
      </v-col>
    </v-row>
    <v-row class="px-2">
      <v-col>
        <v-text-field
          label="Background"
          v-model="map.background"
          dense
          hide-details
        />
      </v-col>
    </v-row>
    <v-row no-gutters class="pr-2">
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
    },
    tileset: {
      type: Array,
      required: true
    }
  }
}
</script>

<style></style>

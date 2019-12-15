<template>
  <v-navigation-drawer permanent app>
    <v-container style="text-align:center">
      <v-btn-toggle v-model="placing" dense>
        <v-btn>Tiles</v-btn>
        <v-btn>Objects</v-btn>
      </v-btn-toggle>
      <v-row>
        <v-col cols="3">
          <v-text-field label="Width" type="number" dense hide-details />
        </v-col>
        <v-col cols="3">
          <v-text-field label="Height" type="number" dense hide-details />
        </v-col>
        <v-col>
          <v-text-field label="Tileset" dense hide-details />
        </v-col>
      </v-row>
    </v-container>
    <object-list
      v-show="placing == 1"
      :map="map"
      @update:npc="$emit('update:npc', $event)"
    />
    <v-container class="fixed-bottom">
      <v-row dense>
        <v-col cols="2">
          <v-btn icon color="green">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <v-select
            :items="Object.keys(maps)"
            label="Map"
            v-model="selectedMap"
            dense
          />
        </v-col>
      </v-row>
      <v-btn @click="$emit('save-map')" tile block>Save Current Map</v-btn>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import ObjectList from '@/components/ObjectList.vue'
export default {
  components: {
    'object-list': ObjectList
  },
  props: {
    maps: {
      type: Object,
      required: true
    },
    npc: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      placing: 1,
      selectedMap: ''
    }
  },
  computed: {
    map() {
      return this.maps[this.selectedMap] ? this.maps[this.selectedMap] : {}
    }
  }
}
</script>

<style>
.fixed-bottom {
  position: absolute;
  bottom: 0;
}
</style>

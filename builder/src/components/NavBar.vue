<template>
  <v-navigation-drawer permanent app>
    <v-container style="text-align:center">
      <v-btn-toggle
        :value="placing"
        @change="$emit('update:placing', $event)"
        mandatory
        dense
      >
        <v-btn>Tiles</v-btn>
        <v-btn>Map</v-btn>
        <v-btn>Objects</v-btn>
      </v-btn-toggle>
    </v-container>
    <tile-controls
      v-show="placing == 0"
      :tileset="tileset"
      :tilesetData="tilesetData"
      @load-tileset="$emit('load-tileset', $event)"
      @select-tile="$emit('select-tile', $event)"
      :map="computedMap"
      :blocksize="blocksize"
    />
    <map-controls v-show="placing == 1" :map="computedMap" />
    <object-list
      v-show="placing == 2"
      :map="computedMap"
      @update:npc="updateNPC"
      @update:object-type="$emit('update:object-type', $event)"
    />
    <v-container class="fixed-bottom">
      <v-row dense>
        <v-col cols="2">
          <v-btn @click="$emit('create-map')" icon color="green">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <v-select
            :items="Object.keys(maps)"
            label="Map"
            :value="map"
            @input="$emit('update:map', $event)"
            dense
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="$emit('save-map')" tile block>
            Save All
            <v-progress-circular
              v-if="saving"
              indeterminate
              color="grey"
            ></v-progress-circular>
          </v-btn>
        </v-col>
        <v-col>
          <v-btn @click="$emit('change-project-folder')" tile block>
            <v-icon v-if="!loading" color="grey">mdi-folder</v-icon>
            <v-progress-circular
              v-if="loading"
              indeterminate
              color="grey"
            ></v-progress-circular>
          </v-btn>
        </v-col>
      </v-row>
      <v-alert v-show="error" text color="red">
        {{ error }}
        <v-btn @click="$emit('show-error-log')" icon color="red">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-alert>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import TileControls from '@/components/TileControls.vue'
import MapControls from '@/components/MapControls.vue'
import ObjectList from '@/components/ObjectList.vue'
export default {
  components: {
    'tile-controls': TileControls,
    'map-controls': MapControls,
    'object-list': ObjectList
  },
  props: {
    placing: {
      type: Number,
      default: 2
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
    },
    maps: {
      type: Object,
      required: true
    },
    map: {
      type: String,
      required: true
    },
    npc: {
      type: Number,
      required: true
    },
    error: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    saving: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedMap: ''
    }
  },
  computed: {
    computedMap() {
      return this.map ? this.maps[this.map] : { nomap: true }
    }
  },
  methods: {
    updateNPC(newNPC) {
      this.$emit('update:npc', newNPC)
      this.$emit('open-npc-editor')
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

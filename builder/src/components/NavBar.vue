<template>
  <v-navigation-drawer permanent app>
    <v-container style="text-align:center">
      <v-btn-toggle v-model="placing" mandatory dense>
        <v-btn>Tiles</v-btn>
        <v-btn>Objects</v-btn>
      </v-btn-toggle>
    </v-container>
    <tile-controls
      v-show="placing == 0"
      :tileset="tileset"
      @update:tileset="emit('update:tileset', $event)"
    />
    <object-list
      v-show="placing == 1"
      :map="computedMap"
      @update:npc="updateNPC"
      @update:object-type="$emit('update:object-type', $event)"
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
import ObjectList from '@/components/ObjectList.vue'
export default {
  components: {
    'tile-controls': TileControls,
    'object-list': ObjectList
  },
  props: {
    tileset: {
      type: Array,
      required: true
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
      placing: 1,
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

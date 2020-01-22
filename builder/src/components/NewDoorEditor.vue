<template>
  <v-row align="center" justify="center">
    <div class="full-cover" @click="$emit('open-room-editor')" />
    <v-card raised class="center-card mt-4">
      <v-card-title>
        {{ stored.isNew ? 'New' : 'Edit' }} Door
        <v-btn @click="$emit('open-room-editor')" absolute right icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select
          label="To map"
          v-model="stored.toMap"
          :items="Object.keys(maps)"
        />
        <v-row>
          <v-col>
            <number-input label="to X" v-model="stored.toX" />
          </v-col>
          <v-col>
            <number-input label="to Y" v-model="stored.toY" />
          </v-col>
        </v-row>
        <v-row justify="end" class="pr-4">
          <v-btn @click="createDoor">Done</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import NumberInput from '@/components/NumberInput.vue'
export default {
  components: {
    'number-input': NumberInput
  },
  props: {
    maps: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    stored: {
      type: Object,
      required: true
    }
  },
  methods: {
    createDoor() {
      if (this.stored.isNew) {
        this.map.doors.push({
          x: this.stored.x,
          y: this.stored.y,
          toX: this.stored.toX,
          toY: this.stored.toY,
          toMap: this.stored.toMap
        })
      } else {
        let _door = this.map.doors[this.stored.index]
        _door.x = this.stored.x
        _door.y = this.stored.y
        _door.toX = this.stored.toX
        _door.toY = this.stored.toY
        _door.toMap = this.stored.toMap
      }
      this.$emit('open-room-editor')
    }
  }
}
</script>

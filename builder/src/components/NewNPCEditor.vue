<template>
  <v-row align="center" justify="center">
    <div class="full-cover" @click="$emit('open-room-editor')" />
    <v-card raised class="center-card mt-4">
      <v-card-title>
        New NPC
        <v-btn @click="$emit('open-room-editor')" absolute right icon>
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-select
          v-if="moveExisting"
          v-model="npcToMove"
          :items="npcs"
          item-text="name"
          item-value="name"
        />
        <v-text-field
          v-else
          label="Name"
          v-model="stored.name"
          :error-messages="nameError"
          @keyup.enter.exact="addNPC"
        />
        <v-switch label="Move Existing NPC" v-model="moveExisting" />
        <v-row justify="end" class="pr-4">
          <v-btn v-if="moveExisting" @click="moveNPC">Move</v-btn>
          <v-btn v-else @click="addNPC">Create</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
export default {
  props: {
    map: {
      type: Object,
      required: true
    },
    npcs: {
      type: Array,
      required: true
    },
    stored: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      creatingNPC: false,
      moveExisting: false,
      npcName: '',
      npcToMove: ''
    }
  },
  computed: {
    nameError() {
      for (let npc of this.npcs)
        if (this.npcName == npc.name) return 'Name must be unique'
      return ''
    }
  },
  methods: {
    removeNPC() {
      if (this.indexToRemove != -1) this.npcs.splice(this.indexToRemove, 1)
    },
    addNPC() {
      if (this.stored.name && !this.nameError) {
        this.npcs.push({
          name: this.stored.name,
          x: this.stored.x,
          y: this.stored.y,
          labels: { Main: [] }
        })
        this.$emit('set-npc', this.npcs.length - 1)
        this.$emit('open-npc-editor')
      }
    },
    moveNPC() {
      if (this.npcToMove) {
        this.moveExisting = false
        for (let npc of this.npcs) {
          if (npc.name == this.npcToMove) {
            this.$set(npc, 'x', this.stored.x)
            this.$set(npc, 'y', this.stored.y)
            break
          }
        }
        this.npcToMove = ''
        this.$emit('open-room-editor')
      }
    }
  }
}
</script>

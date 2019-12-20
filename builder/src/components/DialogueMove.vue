<template>
  <v-card color="#ddffdd">
    <v-card-title>
      Move
      <v-btn absolute right icon small @click="deletePrompt = true">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col class="pt-0">
          <v-select
            v-model="command.move"
            :items="nameAndIndex"
            item-text="name"
            item-value="value"
            label="Character"
          />
          <v-switch v-model="command.teleport" label="Teleport" hide-details />
          <v-checkbox
            v-if="!command.teleport"
            v-model="command.run"
            label="Run"
            hide-details
          />
        </v-col>
        <v-col class="pt-0">
          <v-row v-if="command.teleport" class="mr-1">
            <v-text-field :value="command.x" label="X" @input="updateX" />
            <v-text-field :value="command.y" label="Y" @input="updateY" />
          </v-row>
          <v-radio-group v-else v-model="command.dir">
            <v-radio label="Up" value="u" />
            <v-radio label="Down" value="d" />
            <v-radio label="Left" value="l" />
            <v-radio label="Right" value="r" />
            <v-radio label="Stop" value="s" />
          </v-radio-group>
        </v-col>
      </v-row>
      <delete-menu v-model="deletePrompt" @remove="$emit('remove-action')" />
    </v-card-text>
  </v-card>
</template>

<script>
import deleteMenu from '@/components/DeleteMenu.vue'
export default {
  components: {
    'delete-menu': deleteMenu
  },
  props: {
    command: {
      type: Object,
      required: true
    },
    index: {
      type: String,
      required: true
    },
    npcs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      deletePrompt: false
    }
  },
  computed: {
    nameAndIndex() {
      return [
        { name: 'Player', value: 'player' },
        ...this.npcs.map((npc, i) => ({ name: npc.name, value: i }))
      ]
    }
  },
  methods: {
    updateX(amount) {
      let parsed = parseInt(amount, 10)
      if (isNaN(parsed)) this.command.x = false
      else this.command.x = parsed
    },
    updateY(amount) {
      let parsed = parseInt(amount, 10)
      if (isNaN(parsed)) this.command.y = ''
      else this.command.y = parsed
    }
  }
}
</script>

<style></style>

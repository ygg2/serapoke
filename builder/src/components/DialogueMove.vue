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
          <v-checkbox v-model="command.run" label="Run" />
        </v-col>
        <v-col class="pt-0">
          <v-radio-group v-model="command.dir">
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
  }
}
</script>

<style></style>

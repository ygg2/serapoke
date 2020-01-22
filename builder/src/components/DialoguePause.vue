<template>
  <v-card color="#ffcccc">
    <v-card-text>
      <v-text-field
        label="pause"
        :value="command.pause"
        @input="updatePause"
        type="number"
        suffix="frames"
        color="red"
      >
        <template v-slot:append-outer v-if="!deletePrompt">
          <v-btn icon small @click="deletePrompt = true">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-text-field>
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
        { name: 'Player', index: 0 },
        ...this.npcs.map((npc, i) => ({ name: npc.name, index: i + 1 }))
      ]
    }
  },
  methods: {
    updatePause(amount) {
      let parsed = parseInt(amount, 10)
      if (isNaN(parsed)) this.command.pause = 0
      else this.command.pause = parsed
    }
  }
}
</script>

<style></style>

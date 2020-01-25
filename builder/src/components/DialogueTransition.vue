<template>
  <v-card color="#eeffcc">
    <v-card-text>
      <v-text-field
        label="Transition"
        v-model="command.transition"
        :id="index"
        @keyup.enter="$emit('create-next')"
        @keyup.up.exact="$emit('focus-prev')"
        @keyup.down.exact="$emit('focus-next')"
        @keyup.shift.up="$emit('add-cell-prev')"
        @keyup.shift.down="$emit('add-cell-next')"
        @keyup.shift.enter="$emit('add-cell-next')"
        color="green"
      >
        <template v-slot:append-outer v-if="!deletePrompt">
          <v-btn icon small @click="deletePrompt = true">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-text-field>
      <number-input
        label="Duration"
        v-model="command.duration"
        suffix="frames"
      />
      <delete-menu v-model="deletePrompt" @remove="$emit('remove-action')" />
    </v-card-text>
  </v-card>
</template>

<script>
import NumberInput from '@/components/NumberInput.vue'
import DeleteMenu from '@/components/DeleteMenu.vue'
export default {
  components: {
    'number-input': NumberInput,
    'delete-menu': DeleteMenu
  },
  props: {
    command: {
      type: Object,
      required: true
    },
    index: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      deletePrompt: false
    }
  }
}
</script>

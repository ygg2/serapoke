<template>
  <v-card color="white">
    <v-card-text>
      <v-text-field label="Stat Boost" v-model="command.statboost">
        <template v-slot:append-outer v-if="!deletePrompt">
          <v-btn icon small @click="deletePrompt = true">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-text-field>
      <number-input label="Value" v-model="command.value" dense />
      <v-checkbox label="Relative" v-model="command.relative" />
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
    }
  },
  data() {
    return {
      deletePrompt: false
    }
  }
}
</script>

<style></style>

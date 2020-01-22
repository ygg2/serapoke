<template>
  <v-card color="#cceeff">
    <v-card-text>
      <v-text-field
        label="Name"
        v-model="command.name"
        :id="index"
        @keyup.enter="$emit('create-next')"
        @keyup.up.exact="$emit('focus-prev')"
        @keyup.down.exact="$emit('focus-next')"
        @keyup.shift.up="$emit('add-cell-prev')"
        @keyup.shift.down="$emit('add-cell-next')"
        @keyup.shift.enter="$emit('add-cell-next')"
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

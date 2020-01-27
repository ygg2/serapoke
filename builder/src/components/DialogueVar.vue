<template>
  <v-card color="#ddffff">
    <v-card-text>
      <v-text-field label="Variable" v-model="command.setvar">
        <template v-slot:append-outer v-if="!deletePrompt">
          <v-btn icon small @click="deletePrompt = true">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-text-field>
      <v-text-field label="Value" v-model="command.value" dense />
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

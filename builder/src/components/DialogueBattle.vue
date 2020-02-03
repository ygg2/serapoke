<template>
  <v-card color="#ddffdd">
    <v-card-title>
      Battle
      <v-btn absolute right icon small @click="deletePrompt = true">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-select
        :items="Object.keys(enemies)"
        dense
        solo
        flat
        v-model="command.battle"
      />
      <delete-menu v-model="deletePrompt" @remove="$emit('remove-action')" />
    </v-card-text>
  </v-card>
</template>

<script>
import DeleteMenu from '@/components/DeleteMenu.vue'
export default {
  components: {
    'delete-menu': DeleteMenu
  },
  props: {
    command: {
      type: Object,
      required: true
    },
    enemies: {
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

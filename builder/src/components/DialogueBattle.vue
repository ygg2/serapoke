<template>
  <v-card color="#ddffdd">
    <v-card-title>
      {{ isBattle ? 'Battle' : 'Jump' }}
      <v-btn absolute right icon small @click="deletePrompt = true">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-switch :label="isBattle ? 'Battle' : 'Jump'" v-model="isBattle" />
      <v-select
        v-if="isBattle"
        :items="Object.keys(enemies)"
        dense
        solo
        flat
        v-model="command.battle"
      />
      <v-select v-else :items="labels" dense solo flat v-model="command.jump" />
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
    labels: {
      type: Array,
      required: true
    },
    enemies: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isBattle: this.command.battle ? true : false,
      deletePrompt: false
    }
  },
  watch: {
    isBattle(value) {
      if (value) {
        this.$delete(this.command, 'jump')
        this.$set(this.command, 'battle', '')
      } else {
        this.$delete(this.command, 'battle')
        this.$set(this.command, 'jump', '')
      }
    }
  }
}
</script>

<style></style>

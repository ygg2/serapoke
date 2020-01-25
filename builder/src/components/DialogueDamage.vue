<template>
  <v-card dark>
    <v-card-text>
      <v-text-field
        label="Damage"
        :value="command.damage"
        @input="updateDamage"
        type="number"
        suffix="x"
      >
        <template v-slot:append-outer v-if="!deletePrompt">
          <v-btn icon small @click="deletePrompt = true">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-text-field>
      <delete-menu v-model="deletePrompt" @remove="$emit('remove-action')" />
      <v-checkbox v-model="command.target" label="Target Self" hide-details />
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
  },
  methods: {
    updateDamage(amount) {
      let parsed = parseInt(amount, 10)
      if (isNaN(parsed)) this.command.pause = 0
      else this.command.damage = parsed
    }
  }
}
</script>

<style></style>

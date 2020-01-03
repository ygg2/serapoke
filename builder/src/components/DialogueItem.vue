<template>
  <v-card color="#ddffdd">
    <v-card-title>
      {{ pickupOrDrop }}
      <v-btn absolute right icon small @click="deletePrompt = true">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-switch v-model="isPickup" :label="'Type: ' + pickupOrDrop" />
      <v-label>Item</v-label>
      <v-select
        :items="Object.keys(items)"
        dense
        solo
        flat
        :value="command.pickup || command.drop"
        @input="setItem"
      />
      <v-text-field :label="messageLabel" v-model="command.message" />
      <v-text-field :label="afterLabel" v-model="command.after" />
      <v-text-field
        v-show="!isPickup"
        label="If you never had it"
        v-model="command.backup"
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
    items: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      deletePrompt: false
    }
  },
  computed: {
    isPickup: {
      get: function() {
        return this.command.pickup ? true : false
      },
      set: function(pickup) {
        if (pickup) {
          this.$set(this.command, 'pickup', this.command.drop)
          this.$delete(this.command, 'drop')
        } else {
          this.$set(this.command, 'drop', this.command.pickup)
          this.$delete(this.command, 'pickup')
        }
      }
    },
    pickupOrDrop() {
      return this.command.pickup ? 'Pick Up Item' : 'Drop Item'
    },
    messageLabel() {
      return this.command.drop ? 'When dropping' : 'When picking up'
    },
    afterLabel() {
      return (
        'If you already ' + (this.command.drop ? 'dropped' : 'have') + ' it'
      )
    }
  },
  methods: {
    setItem(item) {
      if (this.command.pickup) {
        this.$set(this.command, 'pickup', item)
      } else {
        this.$set(this.command, 'drop', item)
      }
    }
  }
}
</script>

<style></style>

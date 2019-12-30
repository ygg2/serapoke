<template>
  <v-row align="center" justify="center">
    <div class="full-cover" @click="$emit('open-room-editor')" />
    <v-card raised class="center-card mt-4">
      <v-card-title>
        Items
        <v-btn icon @click="addItem">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-list-item>
          <v-list-item-title>Item name</v-list-item-title>
          <v-list-item-subtitle>Description</v-list-item-subtitle>
        </v-list-item>
        <v-divider />
        <v-list-item v-for="item of sortedItems" :key="item.name">
          <v-list-item-title>{{ items[item].name }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ items[item].description }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
export default {
  props: {
    items: {
      type: Object,
      required: true
    }
  },
  computed: {
    sortedItems() {
      return Object.keys(this.items).sort((a, b) => a.name < b.name)
    }
  },
  methods: {
    addItem() {
      console.log('harro')
    }
  }
}
</script>

<style></style>

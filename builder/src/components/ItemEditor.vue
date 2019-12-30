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
        <v-row>
          <v-col style="max-height:80vh;overflow-y:scroll">
            <v-list-item>
              <v-list-item-subtitle>Display name</v-list-item-subtitle>
              <v-list-item-subtitle>Description</v-list-item-subtitle>
            </v-list-item>
            <v-divider />
            <v-list-item
              v-for="item of sortedItems"
              :key="item.name"
              @click="editItem(item, items[item])"
            >
              <v-list-item-title>{{ items[item].name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ items[item].description }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-col>
          <v-col v-show="itemEditorOpen">
            <v-text-field
              label="True Name (used by game)"
              v-model="trueName"
              :error-messages="nameError"
            />
            <v-text-field label="Display Name" v-model="editingItem.name" />
            <v-text-field
              label="Description"
              v-model="editingItem.description"
            />
            <v-row justify="end" class="pr-4">
              <v-btn @click="save">Save</v-btn>
            </v-row>
          </v-col>
        </v-row>
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
  data() {
    return {
      itemEditorOpen: false,
      trueName: '',
      prevName: '',
      nameError: '',
      editingItem: { name: '', description: '' }
    }
  },
  computed: {
    sortedItems() {
      return Object.keys(this.items).sort((a, b) => a.name < b.name)
    }
  },
  methods: {
    addItem() {
      this.trueName = ''
      this.prevName = ''
      this.editingItem = { name: '', description: '' }
      this.itemEditorOpen = true
    },
    editItem(key, item) {
      this.trueName = key
      this.prevName = key
      this.editingItem = { name: item.name, description: item.description }
      this.itemEditorOpen = true
    },
    save() {
      // reset errors
      this.nameError = ''
      // validate
      if (this.trueName == '') this.nameError = 'Must have a name'
      if (this.trueName != this.prevName) {
        for (let item of Object.keys(this.items)) {
          if (this.trueName == item) {
            this.nameError = 'Another item already has this name'
          }
        }
      }
      // add item to items under its name
      if (!this.nameError) {
        if (this.prevName) {
          this.$delete(this.items, this.prevName)
        }
        this.$set(this.items, this.trueName, this.editingItem)
        // close update panel
        this.itemEditorOpen = false
      }
    }
  }
}
</script>

<style></style>

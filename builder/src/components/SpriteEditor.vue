<template>
  <v-row align="center" justify="center">
    <div class="full-cover" @click="$emit('open-room-editor')" />
    <v-card raised class="center-card mt-4">
      <v-card-title>
        Sprites
        <v-btn icon @click="addSprite">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-row justify="end" class="mr-1">
          <v-btn-toggle v-model="sorting" mandatory>
            <v-btn text value="Default" @click="reset">Chronological</v-btn>
            <v-btn text value="Alphabetical" @click="sort">A-Z</v-btn>
            <v-btn text value="Type" @click="sortType">Type</v-btn>
          </v-btn-toggle>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col style="max-height:80vh;overflow-y:scroll">
            <v-list max-width="100%" dense>
              <v-list-item
                v-for="name of spriteList"
                :key="name"
                @click="editSprite(name)"
              >
                <v-list-item-avatar>
                  <img :src="spritedata[name]" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ name }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    sprites[name]
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col v-show="spriteEditorOpen">
            <v-text-field
              label="Name"
              v-model="editingSprite.name"
              :error-messages="nameError"
            />
            <v-text-field
              label="Image"
              v-model="editingSprite.image"
              :error-messages="imageError"
            />
            <v-row justify="end" class="pr-4">
              <v-btn @click="save">Done</v-btn>
            </v-row>
            <p>Preview</p>
            <img :src="spritedata[editingSprite.name]" style="max-width:100%" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
export default {
  props: {
    sprites: {
      type: Object,
      required: true
    },
    spritedata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      spriteList: Object.keys(this.sprites),
      spriteEditorOpen: false,
      editingSprite: { name: '', image: '' },
      nameError: '',
      imageError: '',
      sorting: 'Default'
    }
  },
  methods: {
    reset() {
      this.spriteList = Object.keys(this.sprites)
    },
    sort() {
      this.spriteList.sort()
    },
    sortType() {
      this.spriteList.sort((a, b) =>
        this.sprites[a] > this.sprites[b] ? -1 : 1
      )
    },
    addSprite() {
      this.spriteEditorOpen = true
      this.editingSprite = { name: '', image: '', prev: '' }
    },
    editSprite(name) {
      this.spriteEditorOpen = true
      this.editingSprite = { name: name, image: this.sprites[name], prev: name }
    },
    save() {
      // reset errors
      this.nameError = ''
      this.imageError = ''
      // validate
      if (this.editingSprite.name == '') this.nameError = 'Must have a name'
      if (!this.editingSprite.image) this.imageError = 'Please choose an image'
      if (this.editingSprite.prev != this.editingSprite.name) {
        for (let spr of Object.keys(this.sprites)) {
          if (this.editingSprite.name == spr) {
            this.nameError = 'Another sprite already has this name'
          }
        }
      }
      // send sprite to be added
      if (!this.nameError && !this.imageError) {
        this.$emit('add-sprite', this.editingSprite)
        // close update panel
        this.spriteEditorOpen = false
      }
      // update sprites
      this.reset()
      if (this.sorting == 'Alphabetical') this.sort()
      else if (this.sorting == 'Type') this.sortType()
    }
  }
}
</script>

<style></style>

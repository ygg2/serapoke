<template>
  <v-row align="center" justify="center">
    <div class="full-cover" @click="$emit('open-room-editor')" />
    <v-card raised style="width:80%;" class="mt-4">
      <v-card-title>New Sprite</v-card-title>
      <v-card-text>
        <v-text-field label="Name" v-model="name" :error-messages="nameError" />
        <v-text-field
          label="Image"
          v-model="image"
          :error-messages="imageError"
        />
        <v-row justify="end" class="pr-4">
          <v-btn @click="createSprite">Create</v-btn>
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
    }
  },
  data() {
    return {
      name: '',
      image: '',
      nameError: '',
      imageError: ''
    }
  },
  methods: {
    createSprite() {
      this.nameError = ''
      this.imageError = ''
      if (!this.name) this.nameError = 'Please name the sprite'
      if (!this.image) this.imageError = 'Please choose an image'
      for (let spr of Object.keys(this.sprites)) {
        if (this.name == spr) this.nameError = 'Another sprite has this name'
      }
      if (!this.nameError && !this.imageError) {
        this.$emit('add-sprite', { name: this.name, image: this.image })
      }
    }
  }
}
</script>

<style></style>

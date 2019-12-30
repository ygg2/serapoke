<template>
  <v-row align="center" justify="center">
    <div class="full-cover" @click="$emit('open-room-editor')" />
    <v-card raised style="width:80%;" class="mt-4">
      <v-card-title>New Map</v-card-title>
      <v-card-text>
        <v-text-field label="Name" v-model="name" :error-messages="nameError" />
        <number-input label="Width" v-model="width" :error="widthError" />
        <number-input label="Height" v-model="height" :error="heightError" />
        <v-row justify="end" class="pr-4">
          <v-btn @click="createMap">Create</v-btn>
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import NumberInput from '@/components/NumberInput.vue'
export default {
  components: {
    'number-input': NumberInput
  },
  data() {
    return {
      name: '',
      width: '10',
      height: '10',
      nameError: '',
      widthError: '',
      heightError: ''
    }
  },
  methods: {
    createMap() {
      // reset errors
      this.nameError = ''
      this.widthError = ''
      this.heightError = ''
      // must have name and integer w/h
      if (!this.name) this.nameError = 'Please name the map'
      let parsedWidth = parseInt(this.width, 10)
      if (isNaN(parsedWidth)) this.widthError = 'Not a valid width'
      let parsedHeight = parseInt(this.height, 10)
      if (isNaN(parsedHeight)) this.heightError = 'Not a valid height'
      if (!(this.nameError || this.widthError || this.heightError)) {
        this.$emit('add-map', {
          name: this.name,
          width: parsedWidth,
          height: parsedHeight,
          background: 'map_' + this.name
        })
      }
    }
  }
}
</script>

<style></style>

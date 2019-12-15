<template>
  <v-app id="about">
    <div>
      <h2>Sprites</h2>
      <div v-for="(spr, name) of sprites" :key="name">
        {{ name }}: {{ spr }}
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  props: {
    sprites: {
      type: Object,
      required: true
    }
  }
}
</script>

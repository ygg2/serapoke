<template>
  <v-card flat max-height="500" style="overflow:scroll">
    <v-list-item @click="$emit('create-sprite')">
      <v-list-item-icon>
        <v-icon>mdi-plus</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Add sprite</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list max-width="100%" dense>
      <v-list-item v-for="(spr, name) of sprites" :key="name">
        <v-list-item-avatar>
          <img :src="spritedata[name]" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ name }}</v-list-item-title>
          <v-list-item-subtitle>{{ spr }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
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
  }
}
</script>

<style></style>

<template>
  <v-speed-dial
    v-model="globalOptionsOpen"
    direction="left"
    transition="slide-x-reverse-transition"
    style="position:fixed;top:5vh;right:5vh"
  >
    <template v-slot:activator>
      <v-btn fab>
        <v-icon v-if="globalOptionsOpen">mdi-close</v-icon>
        <v-icon v-else>mdi-settings</v-icon>
      </v-btn>
    </template>
    <v-btn
      v-for="opt of globalOptionsList"
      fab
      small
      dark
      :color="opt.color"
      :key="opt.name"
      @click="$emit('open-' + opt.name + '-editor')"
    >
      <v-icon>{{ opt.icon }}</v-icon>
    </v-btn>
  </v-speed-dial>
</template>

<script>
export default {
  data() {
    return {
      globalOptionsOpen: false,
      globalOptionsList: [
        { name: 'sprite', color: 'grey', icon: 'mdi-pencil' },
        { name: 'item', color: 'pink', icon: 'mdi-pencil' },
        { name: 'monster', color: 'black', icon: 'mdi-pencil' }
      ]
    }
  }
}
</script>

<style></style>

<template>
  <v-card>
    <v-list dense>
      <!--I think instead I should have what type of object to place maybe-->
      <v-list-item-group>
        <v-list-item v-for="npc of map.npcs" :key="npc.name">
          <v-list-item-content>
            <v-list-item-title v-text="npc.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    map: {
      type: Object,
      required: true
    }
  }
}
</script>

<style></style>

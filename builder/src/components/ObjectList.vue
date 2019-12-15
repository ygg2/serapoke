<template>
  <v-card outlined>
    <v-subheader>Objects</v-subheader>
    <v-list dense>
      <v-list-item-group>
        <v-list-item
          v-for="(npc, i) of map.npcs"
          :key="npc.name"
          @click="$emit('update:npc', i)"
        >
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

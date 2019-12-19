<template>
  <v-row no-gutters class="px-2">
    <v-col cols="3">
      <v-text-field label="Width" type="number" dense hide-details />
    </v-col>
    <v-col cols="3" class="px-2">
      <v-text-field label="Height" type="number" dense hide-details />
    </v-col>
    <v-col>
      <v-file-input
        label="Tileset"
        :value="tileset"
        @input="$emit('update:tileset', tileset)"
        accept="image/*"
        prepend-icon=""
        truncate-length="10"
        :clearable="false"
        dense
        hide-details
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    tileset: {
      type: Array,
      required: true
    }
  }
}
</script>

<style></style>

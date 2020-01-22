<template>
  <v-row v-if="deleting" align="center">
    <v-col>Delete?</v-col>
    <v-col>
      <v-btn
        text
        small
        @click="
          $emit('remove')
          $emit('deleted', false)
        "
        >Yes</v-btn
      >
    </v-col>
    <v-col>
      <v-btn text small @click="$emit('deleted', false)">No</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  model: {
    prop: 'deleting',
    event: 'deleted'
  },
  props: {
    deleting: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style></style>

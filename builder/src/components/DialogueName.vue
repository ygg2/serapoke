<template>
  <v-card color="#cceeff">
    <v-card-text>
      <v-text-field
        label="Name"
        v-model="command.name"
        :id="index"
        @keyup.enter="$emit('create-next')"
      >
        <template v-slot:append-outer v-if="!deletThis">
          <v-btn icon small @click="deletThis = true">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-text-field>
      <v-row v-if="deletThis" align="center">
        <v-col>Delete?</v-col>
        <v-col>
          <v-btn text small @click="$emit('remove-action')">Yes</v-btn>
        </v-col>
        <v-col>
          <v-btn text small @click="deletThis = false">No</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    command: {
      type: Object,
      required: true
    },
    index: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      deletThis: false
    }
  }
}
</script>

<style></style>

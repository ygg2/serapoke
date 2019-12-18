<template>
  <v-card color="#eeccff">
    <v-card-title>Menu</v-card-title>
    <v-card-text>
      <v-row v-for="(op, i) of command.choices" :key="i">
        <v-col>
          {{ op[0] }}
        </v-col>
        <v-col v-if="op.length > 1">
          {{ op[1] }}
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
    }
  }
}
</script>

<style></style>

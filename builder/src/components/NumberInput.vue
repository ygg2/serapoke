<template>
  <v-text-field :value="value" :label="label" @input="updateValue" />
</template>

<script>
export default {
  model: {
    event: 'update-value'
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    updateValue(amount) {
      let parsed = parseInt(amount, 10)
      if (!isNaN(parsed)) this.$emit('update-value', parsed)
    }
  }
}
</script>

<style></style>

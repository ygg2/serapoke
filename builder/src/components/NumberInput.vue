<template>
  <v-text-field
    :value="value"
    :label="label"
    @input="updateValue"
    @keydown.enter="trueUpdate"
  />
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
  data() {
    return {
      cachedValue: null
    }
  },
  methods: {
    updateValue(amount) {
      let parsed = parseInt(amount, 10)
      if (!isNaN(parsed)) {
        this.cachedValue = parsed
        this.$emit('update-value', parsed)
      } else {
        this.cachedValue = null
      }
    },
    trueUpdate() {
      if (this.cachedValue !== null) this.$emit('true-update', this.cachedValue)
    }
  }
}
</script>

<style></style>

<template>
  <div>
    <p>Script Editor</p>
    <p v-for="(line, i) in story" :key="i">{{ line }}</p>
  </div>
</template>

<script>
export default {
  props: {
    story: {
      type: Array,
      required: true
    }
  }
}
</script>

<style></style>

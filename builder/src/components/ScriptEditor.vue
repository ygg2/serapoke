<template>
  <div>
    <p>Script Editor</p>
    <div v-for="(line, i) in story" :key="i">
      <v-text-field
        v-if="typeof line == 'string'"
        v-model="story[i]"
        :id="name + i"
        @keyup.enter="focusNext(name, i)"
        @keyup.up="focusPrev(name, i)"
      />
      <div v-else>{{ typeof line }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    story: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      default: 'error'
    }
  },
  methods: {
    focusNext(npc, index) {
      let elem = document.getElementById(npc + String(index + 1))
      if (elem) {
        elem.focus()
      } else {
        console.log(npc + index)
      }
    },
    focusPrev(npc, index) {
      let elem = document.getElementById(npc + String(index - 1))
      if (elem) {
        elem.focus()
      } else {
        console.log(npc - index)
      }
    }
  }
}
</script>

<style></style>

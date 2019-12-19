<template>
  <v-card color="#eeccff">
    <v-card-title>
      Menu
      <v-btn absolute right icon small @click="deletePrompt = true">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col>Choice Text</v-col>
        <v-col>Script Label</v-col>
      </v-row>
      <v-row v-for="(op, i) of command.choices" :key="i" dense align="center">
        <v-col>
          <v-text-field
            v-model="op[0]"
            @keydown.backspace="labelBeforeBackspace = op[0]"
            @keyup.backspace="deleteChoice(i)"
            dense
            hide-details
            solo
            flat
          />
        </v-col>
        <v-col v-if="op.length > 1">
          <v-select
            :items="labels"
            dense
            hide-details
            solo
            flat
            :value="op[1]"
            @input="$set(op, 1, $event)"
          >
            <template v-slot:prepend-item>
              <v-list-item @click="deleteLabel(i)">
                <v-list-item-title>
                  No Label
                </v-list-item-title>
              </v-list-item>
            </template>
          </v-select>
        </v-col>
        <v-col v-else>
          <v-btn @click="addLabel(i)" text small color="purple">No label</v-btn>
        </v-col>
      </v-row>
      <v-btn @click="addChoice" icon small><v-icon>mdi-plus</v-icon></v-btn>
      <delete-menu v-model="deletePrompt" @remove="$emit('remove-action')" />
    </v-card-text>
  </v-card>
</template>

<script>
import deleteMenu from '@/components/DeleteMenu.vue'
export default {
  components: {
    'delete-menu': deleteMenu
  },
  props: {
    labels: {
      type: Array,
      required: true
    },
    command: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      deletePrompt: false,
      labelBeforeBackspace: ''
    }
  },
  methods: {
    addChoice() {
      this.command.choices.push([''])
    },
    deleteChoice(index) {
      if (this.labelBeforeBackspace == '') {
        this.command.choices.splice(index, 1)
      }
    },
    addLabel(index) {
      this.command.choices[index].push('')
    },
    deleteLabel(index) {
      this.command.choices[index].pop()
    }
  }
}
</script>

<style></style>

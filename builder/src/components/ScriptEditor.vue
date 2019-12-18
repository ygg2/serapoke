<template>
  <v-card-text>
    <p class="title d-flex align-center justify-space-between">
      Script
      <v-btn @click="showDocs = !showDocs" icon>
        <v-icon color="grey">mdi-information</v-icon>
      </v-btn>
    </p>
    <v-expand-transition>
      <div v-show="showDocs">
        <v-divider />
        <v-list dense>
          <v-card-subtitle>Editor Controls</v-card-subtitle>
          <v-list-item v-for="(keycode, i) in keyboardControls" :key="i">
            <v-list-item-content>
              <v-list-item-title v-text="keycode[0]" />
              <v-list-item-subtitle v-text="keycode[1]" />
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
      </div>
    </v-expand-transition>
    <div v-for="(line, i) in story" :key="i">
      <v-text-field
        v-if="typeof line == 'string'"
        v-model="story[i]"
        :id="name + i"
        @keyup.enter.exact="createNext(name, i)"
        @keydown.backspace="lineBeforeBackspace = line"
        @keyup.backspace="removeAction(name, i)"
        @keyup.down.exact="focusNext(name, i)"
        @keyup.up.exact="focusPrev(name, i)"
        @keyup.shift.down="addCellNext(name, i)"
        @keyup.shift.enter="addCellNext(name, i)"
        @keyup.shift.up="addCellPrev(i)"
        dense
      >
        <template v-slot:append-outer>
          <v-speed-dial
            v-if="!line"
            :value="editMenu == i"
            @input="editMenu = i"
          >
            <template v-slot:activator>
              <v-btn icon small>
                <v-icon v-if="editMenu == i">mdi-close</v-icon>
                <v-icon v-else>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <v-btn fab small dark color="green" @click="nameCell(i)">
              <v-icon>mdi-account-card-details</v-icon>
            </v-btn>
            <v-btn fab small dark color="blue">
              <v-icon>mdi-auto-fix</v-icon>
            </v-btn>
          </v-speed-dial>
        </template>
      </v-text-field>
      <div v-else-if="typeof line == 'object'">
        <component
          :is="cellType(line)"
          :command="line"
          :index="name + i"
          @create-next="createNext(name, i)"
          @remove-action="removeAction(name, i)"
          @focus-next="focusNext(name, i)"
          @focus-prev="focusPrev(name, i)"
          @add-cell-next="addCellNext(name, i)"
          @add-cell-prev="addCellPrev(name, i)"
          class="mb-4"
        />
      </div>
      <div v-else>{{ typeof line }}</div>
    </div>
  </v-card-text>
</template>

<script>
/* need icons for

:: name
  -set name (name)

:: menu
  -menu (choices: text, label)

:: items
  -pick up (item, message, after)
  -drop item (item, message, backup - dialogue, after - if already dropped)

jump to label (label)
go to level (level name)
-pause (time in frames)
-transition (transition name)
change sprite (image)
change background (image)
change textbox (show, hide, x, y, image)
change text (x, y)

:: movement
  -move (character)
  -stop (character)

save (no parameters. pass true.)

*/
import DialogueName from '@/components/DialogueName.vue'
import DialogueMenu from '@/components/DialogueMenu.vue'
export default {
  components: {
    'dialogue-name': DialogueName,
    'dialogue-menu': DialogueMenu
  },
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
  data() {
    return {
      lineBeforeBackspace: '',
      editMenu: -1,
      showDocs: false,
      keyboardControls: [
        ['Mouse', 'Select cell'],
        ['[Pencil Icon]', 'Change cell type'],
        ['Enter', 'Next cell (add cell if at end)'],
        ['Up Arrow', 'Previous cell'],
        ['Down Arrow', 'Next cell'],
        ['Shift + Enter or Down', 'Add cell below'],
        ['Shift + Up', 'Add cell above']
      ]
    }
  },
  methods: {
    cellType(line) {
      if (line.name || line.name === '') return 'dialogue-name'
      else return 'dialogue-menu'
    },
    addCell() {
      this.story.push('')
    },
    addCellPrev(index) {
      this.story.splice(index, 0, '')
    },
    addCellNext(npc, index) {
      this.story.splice(index + 1, 0, '')
      this.$nextTick(() => {
        this.focusNext(npc, index)
      })
    },
    createNext(npc, index) {
      if (!this.focusNext(npc, index)) {
        this.addCell()
        this.$nextTick(() => {
          this.focusNext(npc, index)
        })
      }
    },
    focusNext(npc, index) {
      let elem = document.getElementById(npc + String(index + 1))
      if (elem) {
        elem.focus()
        return true
      }
      return false
    },
    focusPrev(npc, index) {
      let elem = document.getElementById(npc + String(index - 1))
      if (elem) {
        elem.focus()
      }
    },
    removeAction(npc, index) {
      if (this.lineBeforeBackspace == '' && this.story.length > 1) {
        this.story.splice(index, 1)
        this.focusPrev(npc, index)
      }
    },
    nameCell(index) {
      this.story.splice(index, 1, { name: '' })
    }
  }
}
</script>

<style></style>

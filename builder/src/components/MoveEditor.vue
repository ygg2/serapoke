<template>
  <v-col style="max-height:90vh; overflow-y:scroll">
    <v-text-field
      solo
      flat
      hide-details
      full-width
      class="title"
      v-model="move.name"
    >
      <template v-slot:prepend>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </template>
      <template v-slot:append-outer>
        <v-btn @click="showDocs = !showDocs" icon>
          <v-icon color="grey">mdi-information</v-icon>
        </v-btn>
      </template>
    </v-text-field>
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
    <v-subheader>Display</v-subheader>
    <v-text-field label="Power" v-model="move.power" hide-details />
    <v-text-field label="Description" v-model="move.description" />
    <v-subheader>Effects</v-subheader>
    <div v-for="(line, i) in move.effects" :key="i">
      <v-text-field
        v-if="typeof line == 'string'"
        v-model="move.effects[i]"
        :id="name + i"
        @keyup.enter.exact="createNext(name, i)"
        @keydown.backspace="lineBeforeBackspace = line"
        @keyup.backspace="removeSpecial(name, i)"
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
            @input="editMenu = editMenu == i ? -1 : i"
            direction="left"
            transition="slide-x-reverse-transition"
          >
            <template v-slot:activator>
              <v-btn icon small>
                <v-icon v-if="editMenu == i">mdi-close</v-icon>
                <v-icon v-else>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <v-btn
              v-for="t of cellTypeList"
              fab
              small
              dark
              :color="t.color"
              @click="setType(t.cellType, i)"
              :key="t.cellType"
            >
              <v-icon>{{ t.icon }}</v-icon>
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
          @remove-action="removeCell(name, i)"
          @focus-next="focusNext(name, i)"
          @focus-prev="focusPrev(name, i)"
          @add-cell-next="addCellNext(name, i)"
          @add-cell-prev="addCellPrev(i)"
          class="mb-4"
        />
      </div>
      <div v-else>[ Function (see actual file) ]</div>
    </div>
    <v-btn text @click="addCell"><v-icon>mdi-plus</v-icon>New</v-btn>
  </v-col>
</template>

<script>
import DialogueDamage from '@/components/DialogueDamage.vue'
import DialogueTemplate from '@/components/DialogueTemplate.vue'
import DialogueTransition from '@/components/DialogueTransition.vue'
import DialoguePause from '@/components/DialoguePause.vue'
export default {
  components: {
    'dialogue-damage': DialogueDamage,
    'dialogue-template': DialogueTemplate,
    'dialogue-transition': DialogueTransition,
    'dialogue-pause': DialoguePause
  },
  props: {
    name: {
      type: String,
      required: true
    },
    move: {
      type: Object,
      required: true
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
      ],
      cellTypeList: [
        {
          color: 'black',
          cellType: 'damage',
          icon: 'mdi-google-photos'
        },
        {
          color: 'light-green',
          cellType: 'transition',
          icon: 'mdi-transition-masked'
        },
        {
          color: 'amber',
          cellType: 'template',
          icon: 'mdi-auto-fix'
        },
        {
          color: 'red',
          cellType: 'pause',
          icon: 'mdi-pause'
        }
      ]
    }
  },
  methods: {
    cellType(line) {
      if (line.template || line.template === '') return 'dialogue-template'
      else if (line.damage || line.damage === 0) return 'dialogue-damage'
      else if (line.transition) return 'dialogue-transition'
      else if (line.pause || line.pause === 0) return 'dialogue-pause'
    },
    addCell() {
      this.move.effects.push('')
    },
    addCellPrev(index) {
      this.move.effects.splice(index, 0, '')
    },
    addCellNext(npc, index) {
      this.move.effects.splice(index + 1, 0, '')
      this.$nextTick(() => {
        this.focusNext(npc, index)
      })
    },
    removeCell(npc, index) {
      this.move.effects.splice(index, 1)
    },
    removeSpecial(npc, index) {
      if (this.lineBeforeBackspace == '' && this.move.effects.length > 1) {
        this.move.effects.splice(index, 1)
        this.focusPrev(npc, index)
      }
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
    setType(name, index) {
      this.editMenu = -1
      switch (name) {
        case 'damage':
          this.move.effects.splice(index, 1, { damage: 0 })
          break
        case 'template':
          this.move.effects.splice(index, 1, { template: '' })
          break
        case 'transition':
          this.move.effects.splice(index, 1, {
            transition: 'fade',
            duration: 0
          })
          break
        case 'pause':
          this.move.effects.splice(index, 1, { pause: 60 })
          break
      }
    }
  }
}
</script>

<style></style>

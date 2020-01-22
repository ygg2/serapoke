<template>
  <v-card-text style="max-height:90vh; overflow-y:scroll">
    <v-text-field
      solo
      flat
      hide-details
      full-width
      class="title"
      :value="label"
      @input="$emit('update-name', $event)"
    >
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
    <div v-for="(line, i) in story" :key="i">
      <v-text-field
        v-if="typeof line == 'string'"
        v-model="story[i]"
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
          :labels="labels"
          :npcs="npcs"
          :index="name + i"
          :items="items"
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
  </v-card-text>
</template>

<script>
import DialogueName from '@/components/DialogueName.vue'
import DialogueMenu from '@/components/DialogueMenu.vue'
import DialogueMove from '@/components/DialogueMove.vue'
import DialogueItem from '@/components/DialogueItem.vue'
import DialoguePause from '@/components/DialoguePause.vue'
export default {
  components: {
    'dialogue-name': DialogueName,
    'dialogue-menu': DialogueMenu,
    'dialogue-move': DialogueMove,
    'dialogue-item': DialogueItem,
    'dialogue-pause': DialoguePause
  },
  props: {
    story: {
      type: Array,
      required: true
    },
    name: {
      type: String,
      default: 'error'
    },
    label: {
      type: String,
      required: true
    },
    labels: {
      type: Array,
      required: true
    },
    npcs: {
      type: Array,
      required: true
    },
    items: {
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
          color: 'orange',
          cellType: 'item',
          icon: 'mdi-briefcase'
        },
        {
          color: 'red',
          cellType: 'pause',
          icon: 'mdi-pause'
        },
        {
          color: 'green',
          cellType: 'move',
          icon: 'mdi-arrow-all'
        },
        {
          color: 'purple',
          cellType: 'menu',
          icon: 'mdi-menu'
        },
        {
          color: 'blue',
          cellType: 'name',
          icon: 'mdi-account-card-details'
        }
      ]
    }
  },
  methods: {
    cellType(line) {
      if (line.name || line.name === '') return 'dialogue-name'
      else if (line.menu) return 'dialogue-menu'
      else if (line.move || line.move === 0) return 'dialogue-move'
      else if (line.pause || line.pause === 0) return 'dialogue-pause'
      else if (line.pickup || line.drop) return 'dialogue-item'
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
    removeCell(npc, index) {
      this.story.splice(index, 1)
    },
    removeSpecial(npc, index) {
      if (this.lineBeforeBackspace == '' && this.story.length > 1) {
        this.story.splice(index, 1)
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
        case 'name':
          this.story.splice(index, 1, { name: '' })
          break
        case 'menu':
          this.story.splice(index, 1, { menu: 'text', choices: [['']] })
          break
        case 'move':
          this.story.splice(index, 1, { move: 'player', dir: 's', run: false })
          break
        case 'pause':
          this.story.splice(index, 1, { pause: 60 })
          break
        case 'item':
          if (this.items) {
            this.story.splice(index, 1, { pickup: Object.keys(this.items)[0] })
          } else {
            this.story.splice(index, 1, { pickup: 'Please create an item.' })
          }
          break
      }
    }
  }
}
</script>

<style></style>

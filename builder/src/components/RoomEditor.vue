<template>
  <div>
    <img :src="spritedata[map.background]" class="top-left" />
    <div class="top-left">
      <div v-for="(row, y) of map.map" :key="'y' + y" :style="displayY">
        <div v-for="(block, x) of row" :key="'x' + x" :style="displayX">
          <block-button
            :block="block"
            @add-object="addObject(x, y)"
            @remove-object="$set(map.map[y], x, 0)"
          />
        </div>
      </div>
    </div>
    <npc-button
      v-for="(door, i) of map.doors"
      :key="i"
      :npc="door"
      :block="3"
      :spritedata="spritedata"
      :blocksize="blocksize"
      @view-npc="viewDoor(i)"
      @remove-npc="promptRemoveDoor(i)"
    />
    <npc-button
      v-for="(npc, i) of map.npcs"
      :key="npc.name"
      :npc="npc"
      :spritedata="spritedata"
      :blocksize="blocksize"
      @view-npc="viewNPC(i)"
      @remove-npc="promptRemoveNPC(npc.name, i)"
    />
    <v-row v-if="editingDoor !== null" align="center" justify="center">
      <div class="full-cover" @click="editingDoor = null" />
      <v-card raised style="width:80%;" class="mt-4">
        <v-card-title>Edit Door</v-card-title>
        <v-card-text>
          <v-select
            label="To map"
            v-model="editingDoor.toMap"
            :items="Object.keys(maps)"
          />
          <v-row>
            <v-col>
              <number-input label="to X" v-model="editingDoor.toX" />
            </v-col>
            <v-col>
              <number-input label="to Y" v-model="editingDoor.toY" />
            </v-col>
          </v-row>
          <v-row justify="end" class="pr-4">
            <v-btn @click="editingDoor = null">Done</v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
    <v-row v-show="creatingNPC" align="center" justify="center">
      <div class="full-cover" @click="creatingNPC = false" />
      <v-card raised style="width:80%;" class="mt-4">
        <v-card-title>
          New NPC
          <v-btn @click="creatingNPC = false" absolute right icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-select
            v-if="moveExisting"
            v-model="npcToMove"
            :items="npcs"
            item-text="name"
            item-value="name"
          />
          <v-text-field
            v-else
            id="npcCard"
            label="Name"
            v-model="npcName"
            :error-messages="nameError"
            @keyup.enter.exact="addNPC"
          />
          <v-switch label="Move Existing NPC" v-model="moveExisting" />
          <v-row justify="end" class="pr-4">
            <v-btn v-if="moveExisting" @click="moveNPC">Move</v-btn>
            <v-btn v-else @click="addNPC">Create</v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
    <v-row v-show="deletePrompt && !targetDoor" align="center" justify="center">
      <div class="full-cover" @click="deletePrompt = false" />
      <v-card raised style="width:80%;" class="mt-4">
        <v-card-title>Permanently delete {{ npcToRemove }}?</v-card-title>
        <v-card-text>
          <delete-menu v-model="deletePrompt" @remove="removeNPC" />
        </v-card-text>
      </v-card>
    </v-row>
    <v-row v-show="deletePrompt && targetDoor" align="center" justify="center">
      <div class="full-cover" @click="deletePrompt = false" />
      <v-card raised style="width:80%;" class="mt-4">
        <v-card-title>Permanently delete door?</v-card-title>
        <v-card-text>
          <delete-menu v-model="deletePrompt" @remove="removeDoor" />
        </v-card-text>
      </v-card>
    </v-row>
  </div>
</template>

<script>
import BlockButton from '@/components/BlockButton.vue'
import NPCButton from '@/components/NPCButton.vue'
import NumberInput from '@/components/NumberInput.vue'
import DeleteMenu from '@/components/DeleteMenu.vue'
export default {
  components: {
    'block-button': BlockButton,
    'npc-button': NPCButton,
    'number-input': NumberInput,
    'delete-menu': DeleteMenu
  },
  props: {
    maps: {
      type: Object,
      required: true
    },
    map: {
      type: Object,
      required: true
    },
    spritedata: {
      type: Object,
      required: true
    },
    blocksize: {
      type: Number,
      default: 16
    },
    objtype: {
      type: Number,
      default: 0
    },
    npcs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      creatingNPC: false,
      moveExisting: false,
      npcName: '',
      npcToMove: '',
      npcToRemove: '',
      indexToRemove: -1,
      deletePrompt: false,
      npcX: 0,
      npcY: 0,
      targetDoor: false,
      editingDoor: null,
      displayX: {
        display: 'inline-block',
        height: '100%',
        width: this.blocksize.toString() + 'px'
      },
      displayY: {
        display: 'block',
        height: this.blocksize.toString() + 'px'
      }
    }
  },
  computed: {
    nameAndIndex() {
      return [
        ...this.map.doors.map((door, i) => ({ name: door.name, index: i }))
      ]
    },
    nameError() {
      for (let npc of this.npcs)
        if (this.npcName == npc.name) return 'Name must be unique'
      return ''
    }
  },
  methods: {
    promptRemoveNPC(name, index) {
      this.npcToRemove = name
      this.indexToRemove = index
      this.targetDoor = false
      this.deletePrompt = true
    },
    promptRemoveDoor(index) {
      this.indexToRemove = index
      this.targetDoor = true
      this.deletePrompt = true
    },
    removeNPC() {
      if (this.indexToRemove != -1) this.npcs.splice(this.indexToRemove, 1)
    },
    removeDoor() {
      if (this.indexToRemove != -1) this.map.doors.splice(this.indexToRemove, 1)
    },
    addObject(x, y) {
      // types: 0 - block, 1 - npc, 2 - door
      switch (this.objtype) {
        case 0:
          if (this.map.map[y][x]) this.$set(this.map.map[y], x, 0)
          else this.$set(this.map.map[y], x, 1)
          break
        case 1:
          this.npcX = x
          this.npcY = y
          this.npcName = ''
          this.creatingNPC = true
          this.$nextTick(() => {
            document.getElementById('npcCard').focus()
          })
          break
        case 2:
          this.map.doors.push({
            x: x,
            y: y,
            toX: 0,
            toY: 0,
            toMap: Object.keys(this.maps)[0]
          })
          this.editingDoor = this.map.doors[this.map.doors.length - 1]
      }
    },
    addNPC() {
      if (this.npcName && !this.nameError) {
        this.creatingNPC = false
        this.npcs.push({
          name: this.npcName,
          x: this.npcX,
          y: this.npcY,
          labels: { Main: [] }
        })
        this.$emit('set-npc', this.npcs.length - 1)
        this.$emit('open-npc-editor')
      }
    },
    moveNPC() {
      if (this.npcToMove) {
        this.creatingNPC = false
        this.moveExisting = false
        for (let npc of this.npcs) {
          if (npc.name == this.npcToMove) {
            this.$set(npc, 'x', this.npcX)
            this.$set(npc, 'y', this.npcY)
            break
          }
        }
        this.npcToMove = ''
      }
    },
    viewNPC(index) {
      this.$emit('set-npc', index)
      this.$emit('open-npc-editor')
    },
    viewDoor(index) {
      this.editingDoor = this.map.doors[index]
    }
  }
}
</script>

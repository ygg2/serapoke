<template>
  <div
    class="top-left"
    @mousedown.left="isAdding = true"
    @mouseup="isAdding = false"
  >
    <div :style="absoluteSize">
      <div v-for="(row, y) of map.map" :key="'y' + y" :style="displayY">
        <div v-for="(block, x) of row" :key="'x' + x" :style="displayX">
          <block-button
            :block="block"
            @add-object="addObject(x, y)"
            @mouse-over="addIfDown(x, y)"
            @remove-object="removeBlock(x, y)"
          />
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
    </div>
    <v-row v-show="deletePrompt && !targetDoor">
      <div class="full-cover" @click="deletePrompt = false" />
      <v-card raised :style="deleteStyle">
        <v-card-title>Permanently delete {{ npcToRemove }}?</v-card-title>
        <v-card-text>
          <delete-menu v-model="deletePrompt" @remove="removeNPC" />
        </v-card-text>
      </v-card>
    </v-row>
    <v-row v-show="deletePrompt && targetDoor">
      <div class="full-cover" @click="deletePrompt = false" />
      <v-card raised :style="deleteStyle">
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
import DeleteMenu from '@/components/DeleteMenu.vue'
export default {
  components: {
    'block-button': BlockButton,
    'npc-button': NPCButton,
    'delete-menu': DeleteMenu
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
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
      toRemoveX: 0,
      toRemoveY: 0,
      targetDoor: false,
      editingDoor: null,
      isAdding: false,
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
    absoluteSize() {
      if (this.map.nomap) return {}
      return {
        width: String(this.blocksize * this.map.map[0].length) + 'px',
        height: String(this.blocksize * this.map.map.length) + 'px',
        position: 'relative'
      }
    },
    nameAndIndex() {
      return [
        ...this.map.doors.map((door, i) => ({ name: door.name, index: i }))
      ]
    },
    nameError() {
      for (let npc of this.npcs)
        if (this.npcName == npc.name) return 'Name must be unique'
      return ''
    },
    deleteStyle() {
      let _left = 0,
        _top = 0
      if (!this.map.nomap) {
        _left = Math.min(this.toRemoveX, this.map.map[0].length - 5)
        _top = Math.min(this.toRemoveY, this.map.map.length - 2)
      }
      if (_left < 0) _left = 0
      if (_top < 0) _top = 0
      return {
        position: 'absolute',
        left: String(_left * this.blocksize) + 'px',
        top: String(_top * this.blocksize) + 'px'
      }
    }
  },
  watch: {
    active() {
      this.isAdding = false
    }
  },
  methods: {
    promptRemoveNPC(name, index) {
      if (this.active) {
        this.toRemoveX = this.npcs[index].x
        this.toRemoveY = this.npcs[index].y
        this.npcToRemove = name
        this.indexToRemove = index
        this.targetDoor = false
        this.deletePrompt = true
      }
    },
    promptRemoveDoor(index) {
      if (this.active) {
        this.indexToRemove = index
        this.toRemoveX = this.map.doors[index].x
        this.toRemoveY = this.map.doors[index].y
        this.targetDoor = true
        this.deletePrompt = true
      }
    },
    removeBlock(x, y) {
      if (this.active) {
        this.$set(this.map.map[y], x, 0)
      }
    },
    removeNPC() {
      if (this.indexToRemove != -1) this.npcs.splice(this.indexToRemove, 1)
    },
    removeDoor() {
      if (this.indexToRemove != -1) this.map.doors.splice(this.indexToRemove, 1)
    },
    addObject(x, y) {
      if (this.active) {
        // types: 0 - block, 1 - npc, 2 - door
        switch (this.objtype) {
          case 0:
            if (this.map.map[y][x]) this.$set(this.map.map[y], x, 0)
            else this.$set(this.map.map[y], x, 1)
            break
          case 1:
            this.$emit('open-new-npc-editor', {
              x: x,
              y: y,
              name: ''
            })
            break
          case 2:
            this.$emit('open-new-door-editor', {
              x: x,
              y: y,
              toX: 0,
              toY: 0,
              toMap: Object.keys(this.maps)[0]
            })
            break
        }
      }
    },
    addIfDown(x, y) {
      if (this.active) {
        if (this.isAdding && this.objtype == 0) {
          this.$set(this.map.map[y], x, 1)
        }
      }
    },
    viewNPC(index) {
      if (this.active) {
        this.$emit('set-npc', index)
        this.$emit('open-npc-editor')
      }
    },
    viewDoor(index) {
      if (this.active) {
        this.$emit('open-door-editor', index)
      }
    }
  }
}
</script>

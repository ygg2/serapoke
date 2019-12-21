<template>
  <div>
    <img :src="spritedata[map.background]" class="top-left" />
    <div class="top-left">
      <div v-for="(row, y) of map.map" :key="'y' + y" :style="displayY">
        <div v-for="(block, x) of row" :key="'x' + x" :style="displayX">
          <block-button :block="block" @add-object="addObject(x, y)" />
        </div>
      </div>
    </div>
    <npc-button
      v-for="(npc, i) of map.npcs"
      :key="npc.name"
      :npc="npc"
      :spritedata="spritedata"
      :blocksize="blocksize"
      @view-npc="viewNPC(i)"
      @remove-npc="promptRemoveNPC(npc.name, i)"
    />
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
    <v-row v-show="deletePrompt" align="center" justify="center">
      <div class="full-cover" @click="deletePrompt = false" />
      <v-card raised style="width:80%;" class="mt-4">
        <v-card-title>Permanently delete {{ npcToRemove }}?</v-card-title>
        <v-card-text>
          <delete-menu v-model="deletePrompt" @remove="removeNPC" />
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
      this.deletePrompt = true
    },
    removeNPC() {
      if (this.indexToRemove != -1) this.npcs.splice(this.indexToRemove, 1)
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
    }
  }
}
</script>
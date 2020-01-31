<template>
  <v-row align="center" justify="center">
    <div class="full-cover" @click="$emit('open-room-editor')" />
    <v-card raised class="center-card mt-4">
      <v-card-text>
        <v-row>
          <v-col lg="4">
            <v-card-title>
              Enemies
              <v-btn icon @click="addEnemy">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-card-title>
            <v-btn-toggle v-model="sorting" mandatory>
              <v-btn text value="Default" @click="reset">Chronological</v-btn>
              <v-btn text value="Alphabetical" @click="sort">A-Z</v-btn>
            </v-btn-toggle>
            <v-list
              max-width="100%"
              dense
              style="max-height:60vh;overflow-y:scroll"
            >
              <v-list-item
                v-for="name of enemyList"
                :key="name"
                @click="editEnemy(name)"
              >
                <v-list-item-avatar>
                  <img :src="spritedata[enemies[name].image]" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col
            v-show="enemyEditorOpen && moveSelected == -1"
            style="max-height:80vh;overflow-y:scroll"
          >
            <v-text-field
              label="Name"
              v-model="editingEnemyName"
              @change="updateName"
              :error-messages="nameError"
              dense
            />
            <v-text-field label="Display Name" v-model="editingEnemy.name" />
            <v-row>
              <v-col cols="6">
                <v-text-field
                  label="Image"
                  v-model="editingEnemy.image"
                  :error-messages="imageError"
                  dense
                />
                <number-input label="HP" v-model="editingEnemy.hp" dense />
                <number-input
                  label="Speed"
                  v-model="editingEnemy.speed"
                  dense
                />
                <number-input label="Attack" v-model="editingEnemy.atk" dense />
                <number-input
                  label="Defense"
                  v-model="editingEnemy.def"
                  dense
                />
              </v-col>
              <v-col cols="6">
                <v-img :src="spritedata[editingEnemy.image]">
                  <template v-slot:placeholder>
                    <v-progress-circular indeterminate />
                  </template>
                </v-img>
                <p>Stat total: {{ statTotal }}</p>
              </v-col>
            </v-row>
            <v-subheader style="position:relative">
              Moves
              <v-btn absolute right icon small @click="addMove()">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-subheader>
            <v-list>
              <v-list-item
                v-for="(move, index) of editingEnemy.moves"
                :key="move.name + index"
                @click="moveSelected = index"
                @contextmenu="promptDeleteMove(index)"
              >
                <v-list-item-content>
                  {{ move.name }}
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    icon
                    x-small
                    v-if="deleting == index"
                    @click="deleteMove()"
                  >
                    <v-icon>mdi-minus</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-col>
          <move-editor
            v-if="enemyEditorOpen && moveSelected != -1"
            :name="editingEnemy.name"
            :move="editingEnemy.moves[moveSelected]"
            @close="moveSelected = -1"
          />
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import NumberInput from '@/components/NumberInput.vue'
import MoveEditor from '@/components/MoveEditor.vue'
export default {
  components: {
    'number-input': NumberInput,
    'move-editor': MoveEditor
  },
  props: {
    enemies: {
      type: Object,
      required: true
    },
    spritedata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      enemyList: Object.keys(this.enemies),
      enemyEditorOpen: false,
      moveSelected: -1,
      editingEnemyName: '',
      editingEnemy: { name: '', image: '' },
      nameError: '',
      imageError: '',
      deleting: -1,
      prev: '',
      sorting: 'Default'
    }
  },
  computed: {
    statTotal() {
      return (
        this.editingEnemy.atk +
        this.editingEnemy.def +
        this.editingEnemy.speed +
        this.editingEnemy.hp
      )
    }
  },
  methods: {
    reset() {
      this.enemyList = Object.keys(this.enemies)
    },
    sort() {
      this.enemyList.sort()
    },
    addEnemy() {
      this.enemyEditorOpen = true
      this.moveSelected = -1
      this.editingEnemy = { name: '', image: '', moves: [] }
      this.enemies['New Enemy'] = this.editingEnemy
      this.editingEnemyName = 'New Enemy'
      this.prev = 'New Enemy'
      this.deleting = -1
    },
    editEnemy(name) {
      this.enemyEditorOpen = true
      this.moveSelected = -1
      this.editingEnemy = this.enemies[name]
      this.editingEnemyName = name
      this.prev = name
      this.deleting = -1
    },
    updateName(name) {
      this.nameError = ''
      for (let key of Object.keys(this.enemies)) {
        if (key == name) {
          this.nameError = 'Another enemy has this name.'
        }
      }
      if (!this.nameError) {
        this.$set(this.enemies, name, this.editingEnemy)
        this.$delete(this.enemies, this.prev)
        this.reset()
      }
    },
    addMove() {
      this.editingEnemy.moves.push({
        name: 'New Move',
        power: 0,
        effects: []
      })
    },
    promptDeleteMove(index) {
      this.deleting = index
    },
    deleteMove() {
      this.editingEnemy.moves.splice(this.deleting, 1)
      this.deleting = -1
    }
  }
}
</script>

<style></style>

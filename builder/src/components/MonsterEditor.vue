<template>
  <v-row align="center" justify="center">
    <div class="full-cover" @click="$emit('open-room-editor')" />
    <v-card raised class="center-card mt-4">
      <v-card-title>
        Enemies
        <v-btn icon @click="addEnemy">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-row justify="end" class="mr-1">
          <v-btn-toggle v-model="sorting" mandatory>
            <v-btn text value="Default" @click="reset">Chronological</v-btn>
            <v-btn text value="Alphabetical" @click="sort">A-Z</v-btn>
          </v-btn-toggle>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col style="max-height:80vh;overflow-y:scroll">
            <v-list max-width="100%" dense>
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
          <v-col v-show="enemyEditorOpen">
            <v-text-field
              label="Name"
              v-model="editingEnemy.name"
              :error-messages="nameError"
            />
            <v-text-field
              label="Image"
              v-model="editingEnemy.image"
              :error-messages="imageError"
            />
            <number-input label="HP" v-model="editingEnemy.hp" />
            <number-input label="Speed" v-model="editingEnemy.speed" />
            <number-input label="Attack" v-model="editingEnemy.atk" />
            <number-input label="Defense" v-model="editingEnemy.def" />
            <p v-for="move of editingEnemy.moves" :key="move">
              {{ move }}
            </p>
            <v-row justify="end" class="pr-4">
              <v-btn @click="save">Save</v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-row>
</template>

<script>
import NumberInput from '@/components/NumberInput.vue'
export default {
  components: {
    'number-input': NumberInput
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
      editingEnemy: { name: '', image: '' },
      nameError: '',
      imageError: '',
      sorting: 'Default'
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
      this.editingEnemy = { name: '', image: '', prev: '' }
    },
    editEnemy(name) {
      this.enemyEditorOpen = true
      let enemy = this.enemies[name]
      this.editingEnemy = {
        name: name,
        image: enemy.image,
        hp: enemy.hp,
        speed: enemy.speed,
        atk: enemy.atk,
        def: enemy.def,
        prev: name
      }
    },
    save() {
      // reset errors
      this.nameError = ''
      this.imageError = ''
      // validate
      if (this.editingEnemy.name == '') this.nameError = 'Must have a name'
      if (!this.editingEnemy.image) this.imageError = 'Please choose an image'
      if (this.editingEnemy.prev != this.editingEnemy.name) {
        for (let enemy of Object.keys(this.enemies)) {
          if (this.editingEnemy.name == enemy) {
            this.nameError = 'Another enemy already has this name'
          }
        }
      }
      // add enemy
      if (!this.nameError && !this.imageError) {
        this.enemies[this.editingEnemy.name] = {
          name: this.editingEnemy.name,
          image: this.editingEnemy.image,
          hp: this.editingEnemy.hp,
          speed: this.editingEnemy.speed,
          atk: this.editingEnemy.atk,
          def: this.editingEnemy.def
        }
        // close update panel
        this.enemyEditorOpen = false
      }
      // update sprites
      this.reset()
      if (this.sorting == 'Alphabetical') this.sort()
    }
  }
}
</script>

<style></style>

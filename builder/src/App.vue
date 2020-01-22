<template>
  <v-app id="app">
    <nav-bar
      :placing.sync="placing"
      :spritedata="spriteData"
      :sprites="sprites"
      :tileset="tileset"
      :tilesetData="tilesetData"
      :blocksize="blocksize"
      :maps="maps"
      :map.sync="selectedMap"
      :npc.sync="selectedNPC"
      :object-type.sync="objtype"
      :error="error"
      :loading="isLoading"
      :saving="isSaving"
      @save-map="saveStuff"
      @load-tileset="loadTileset"
      @select-tile="placingtile = $event"
      @change-project-folder="changeProjectFolder"
      @show-error-log="showErrorLog = true"
      @open-npc-editor="currentEditor = 'npc-editor'"
      @create-map="currentEditor = 'new-map-editor'"
    />
    <v-content app>
      <div style="max-width:100%;overflow:scroll">
        <div
          style="height: 100vh; background: linear-gradient(black, white); position: relative;"
          :style="divMapSizing"
        >
          <tile-editor
            :placing="placing"
            :map="computedMap"
            :mapname="selectedMap"
            :tempdata="tempTileMaps"
            :spritedata="spriteData"
            :blocksize="blocksize"
            :tileset="tilesetData"
            :placingtile="placingtile"
            @save-temp-map="saveTempMap"
          />
          <room-editor
            v-if="placing == 2"
            :active="roomEditorActive"
            :maps="maps"
            :map="computedMap"
            :spritedata="spriteData"
            :objtype="objtype"
            :npcs="selectedNPCs"
            :blocksize="blocksize"
            @set-npc="selectedNPC = $event"
            @open-npc-editor="currentEditor = 'npc-editor'"
            @open-new-npc-editor="openNewNPCEditor"
            @open-new-door-editor="openNewDoorEditor"
            @open-door-editor="openDoorEditor"
          />
        </div>
      </div>
      <component
        :is="currentEditor"
        :selected.sync="selected"
        :sprites="sprites"
        :spritedata="spriteData"
        :items="items"
        :enemies="enemies"
        :npcs="selectedNPCs"
        :map="computedMap"
        :maps="maps"
        :objtype="objtype"
        :stored="storedData"
        @open-room-editor="currentEditor = 'no-editor'"
        @open-sprite-editor="currentEditor = 'sprite-editor'"
        @open-npc-editor="currentEditor = 'npc-editor'"
        @open-item-editor="currentEditor = 'item-editor'"
        @open-monster-editor="currentEditor = 'monster-editor'"
        @add-map="addMap"
        @add-sprite="addSprite"
      />
      <v-snackbar
        v-model="notifVisible"
        absolute
        bottom
        :color="notifColor"
        :timeout="3000"
      >
        {{ notif }}
        <v-btn text @click="notifVisible = false">CLOSE</v-btn>
      </v-snackbar>
      <v-dialog v-model="showErrorLog">
        <v-card>
          <v-card-title>Error Log</v-card-title>
          <v-card-text>
            <p v-for="(err, i) of errorLog" :key="i">{{ err }}</p>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-content>
  </v-app>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import TileEditor from '@/components/TileEditor.vue'
import RoomEditor from '@/components/RoomEditor.vue'
import SpriteEditor from '@/components/SpriteEditor.vue'
import ItemEditor from '@/components/ItemEditor.vue'
import MonsterEditor from '@/components/MonsterEditor.vue'
import NPC from '@/components/NPC.vue'
import MainControls from '@/components/MainControls.vue'
import NewMapEditor from '@/components/NewMapEditor.vue'
import NewNPCEditor from '@/components/NewNPCEditor.vue'
import NewDoorEditor from '@/components/NewDoorEditor.vue'
var fs = require('fs')
const fsprom = fs.promises
var path = require('path')
const { app, dialog } = require('electron').remote

export default {
  components: {
    'nav-bar': NavBar,
    'tile-editor': TileEditor,
    'room-editor': RoomEditor,
    'sprite-editor': SpriteEditor,
    'item-editor': ItemEditor,
    'monster-editor': MonsterEditor,
    'new-map-editor': NewMapEditor,
    'npc-editor': NPC,
    'new-npc-editor': NewNPCEditor,
    'new-door-editor': NewDoorEditor,
    'no-editor': MainControls
  },
  data() {
    return {
      currentEditor: 'no-editor',
      placing: 2,
      blocksize: 64,
      sprites: {},
      spriteData: {},
      items: {},
      enemies: {},
      maps: {
        defaultmap: {
          map: [[]],
          npcs: [{ name: 'NPC', dialogue: ['sample dialogue'] }]
        }
      },
      selectedMap: 'defaultmap',
      selectedNPC: 0,
      objtype: 0,
      tileset: [],
      tilesetData: '',
      placingtile: {},
      tempTileMaps: {},
      projectPath: '',
      error: '',
      errorLog: [],
      showErrorLog: false,
      notifVisible: false,
      notif: '',
      notifColor: 'green',
      isLoading: false,
      isSaving: false,
      // store for passing data in new npc make method
      storedData: {
        x: 0,
        y: 0,
        name: '',
        toX: 0,
        toY: 0,
        toMap: '',
        isNew: false,
        index: -1
      }
    }
  },
  computed: {
    roomEditorActive() {
      return this.currentEditor == 'no-editor'
    },
    selected() {
      // return object containing NOMAP or NONPC flags
      if (!this.selectedMap) return { nomap: true, nonpcs: true }
      if (!this.maps[this.selectedMap].npcs.length) return { nonpcs: true }
      return this.maps[this.selectedMap].npcs[this.selectedNPC]
    },
    selectedNPCs() {
      if (!this.selectedMap) return []
      return this.maps[this.selectedMap].npcs
    },
    computedMap() {
      return this.selectedMap ? this.maps[this.selectedMap] : { nomap: true }
    },
    divMapSizing() {
      let _width = this.computedMap.nomap ? 0 : this.computedMap.map[0].length
      return {
        width: String(_width * this.blocksize) + 'px'
      }
    }
  },
  mounted() {
    let appData = path.join(app.getPath('userData'), 'projectpath.txt')
    try {
      this.projectPath = fs.readFileSync(appData, { encoding: 'utf8' })
      this.loadStuff()
    } catch (err) {
      this.changeProjectFolder()
    }
  },
  methods: {
    openNewNPCEditor({ x, y, name }) {
      this.storedData.x = x
      this.storedData.y = y
      this.storedData.name = name
      this.currentEditor = 'new-npc-editor'
    },
    openNewDoorEditor({ x, y, toX, toY, toMap }) {
      this.storedData.x = x
      this.storedData.y = y
      this.storedData.toX = toX
      this.storedData.toY = toY
      this.storedData.toMap = toMap
      this.storedData.isNew = true
      this.currentEditor = 'new-door-editor'
    },
    openDoorEditor(index) {
      let _door = this.computedMap.doors[index]
      this.storedData.x = _door.x
      this.storedData.y = _door.y
      this.storedData.toX = _door.toX
      this.storedData.toY = _door.toY
      this.storedData.toMap = _door.toMap
      this.storedData.isNew = false
      this.storedData.index = index
      this.currentEditor = 'new-door-editor'
    },
    saveTempMap({ name, image }) {
      if (name && name in this.maps) {
        this.tempTileMaps[name] = image
      }
    },
    addMap({ name, width, height, background }) {
      this.$set(this.maps, name, {
        map: [],
        background: background,
        npcs: [],
        doors: []
      })
      for (var i = 0; i < height; i++) {
        this.maps[name].map.push([])
        for (var j = 0; j < width; j++) {
          this.maps[name].map[i].push(0)
        }
      }
      this.currentEditor = 'no-editor'
      this.$nextTick(() => {
        this.selectedMap = name
      })
    },
    addSprite({ name, image, prev }) {
      if (prev != '') {
        this.$delete(this.sprites, prev)
      }
      this.$set(this.sprites, name, image)
      this.$set(this.spriteData, name, this.base64(image))
    },
    loadTileset(file) {
      this.tilesetData = this.base64(file, false)
    },
    showNotif(message, error = true) {
      // log an error in the error log
      if (error) {
        this.error = message
        this.errorLog.push(message)
      }
      // display notification at the bottom of the screen
      this.notifColor = error ? 'red' : 'green'
      this.notif = message
      this.notifVisible = true
    },
    logError(message) {
      this.errorLog.push(message)
    },
    changeProjectFolder() {
      // ask for file
      let savePath = dialog.showOpenDialogSync({
        message: 'Choose the project folder to save in',
        properties: ['openDirectory']
      })
      // set the project path and save it to appdata
      if (savePath) {
        this.error = ''
        this.projectPath = savePath[0]
        let appData = path.join(app.getPath('userData'), 'projectpath.txt')
        try {
          fs.writeFileSync(appData, this.projectPath)
        } catch (err) {
          fs.appendFileSync(appData, this.projectPath)
        }
        this.loadStuff()
      } else {
        // warn if the user closed the file dialog
        this.error = 'Warning: you must choose a folder.'
      }
    },
    async loadFile(fileName, sliceAmount, storeVar) {
      try {
        let file = path.join(this.projectPath, fileName)
        let data = await fsprom.readFile(file, { encoding: 'utf8' })
        this[storeVar] = JSON.parse(data.slice(sliceAmount))
      } catch (err) {
        if (err instanceof SyntaxError) {
          this.showNotif('Error parsing ' + storeVar + ' file.')
        } else {
          this.showNotif('Error reading ' + storeVar + ' file.')
        }
        this.logError(err)
        return false
      }
      return true
    },
    async loadStuff() {
      let success = true
      this.isLoading = true

      // load sprites
      success = await this.loadFile('scripts/sprite.js', 14, 'sprites')
      // convert sprites to base64 strings
      for (let key of Object.keys(this.sprites)) {
        let value = this.sprites[key]
        this.spriteData[key] = this.base64(value)
      }

      // load items
      success = await this.loadFile('scripts/item.js', 12, 'items')
      // load enemies
      success = await this.loadFile('scripts/enemy.js', 13, 'enemies')
      // load maps
      this.selectedMap = ''
      success = await this.loadFile('scripts/room.js', 11, 'maps')

      // once everything has loaded
      this.isLoading = false
      if (success) {
        this.showNotif('Successfully loaded project ' + this.projectPath, false)
      }
    },
    // save JSON as js file by appending variable declaration to it
    async saveStuff() {
      this.isSaving = true
      if (this.projectPath) {
        try {
          // saving sprites
          let spritetxt = 'var SPRITES = ' + JSON.stringify(this.sprites)
          let spriteFile = path.join(this.projectPath, 'scripts/sprite.js')
          await fsprom.writeFile(spriteFile, spritetxt)
          // saving items
          let itemtxt = 'var items = ' + JSON.stringify(this.items)
          let itemFile = path.join(this.projectPath, 'scripts/item.js')
          await fsprom.writeFile(itemFile, itemtxt)
          // saving enemies
          let enemytxt = 'var enemies = ' + JSON.stringify(this.enemies)
          let enemyFile = path.join(this.projectPath, 'scripts/enemy.js')
          await fsprom.writeFile(enemyFile, enemytxt)
          // saving maps
          let maptxt = 'var maps = ' + JSON.stringify(this.maps)
          let mapFile = path.join(this.projectPath, 'scripts/room.js')
          await fsprom.writeFile(mapFile, maptxt)
          // saving tile maps
          let file, data, buffer
          for (let key of Object.keys(this.tempTileMaps)) {
            if (this.maps[key]) {
              file = path.join(
                this.projectPath,
                this.sprites[this.maps[key].background]
              )
              data = this.tempTileMaps[key].slice(22)
              buffer = Buffer.from(data, 'base64')
              await fsprom.writeFile(file, buffer)
            }
          }
          // also save current tile map
          if (this.selectedMap) {
            let canvas = document.getElementById('tileCanvas')
            file = path.join(
              this.projectPath,
              this.sprites[this.computedMap.background]
            )
            data = canvas.toDataURL('image/png').slice(22)
            buffer = Buffer.from(data, 'base64')
            await fsprom.writeFile(file, buffer)
          }
        } catch (error) {
          this.showNotif('Error during project save.')
          this.logError(error)
        }
      } else {
        this.error = 'Cannot save without a valid project folder.'
      }
      this.isSaving = false
    },
    base64(spriteFile, relativepath = true) {
      let data
      if (relativepath) {
        data = fs.readFileSync(path.join(this.projectPath, spriteFile))
      } else {
        data = fs.readFileSync(spriteFile)
      }
      let base64Image = Buffer.from(data, 'binary').toString('base64')
      let imgSrcString = `data:image/png;base64,${base64Image}`
      return imgSrcString
    }
  }
}
</script>

<style>
html {
  overflow-y: hidden !important;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.full-cover {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
a {
  text-decoration: none;
}
.crisp {
  image-rendering: crisp-edges;
  image-rendering: pixelated;
}
.top-left {
  position: absolute;
  left: 0;
  top: 0;
}
.center-card {
  position: fixed;
  top: 0;
  width: 60%;
  max-height: 92vh;
}
</style>

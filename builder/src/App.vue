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
    <v-content style="overflow:scroll" app>
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
        class="top-left"
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
      />
      <component
        :is="currentEditor"
        :selected.sync="selected"
        :sprites="sprites"
        :spritedata="spriteData"
        :items="items"
        :npcs="selectedNPCs"
        :map="computedMap"
        :objtype="objtype"
        @open-room-editor="currentEditor = 'no-editor'"
        @open-sprite-editor="currentEditor = 'sprite-editor'"
        @open-item-editor="currentEditor = 'item-editor'"
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
import NPC from '@/components/NPC.vue'
import MainControls from '@/components/MainControls.vue'
import NewMapEditor from '@/components/NewMapEditor.vue'
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
    'new-map-editor': NewMapEditor,
    'npc-editor': NPC,
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
      isSaving: false
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
    async loadStuff() {
      let success = true
      this.isLoading = true

      // load sprites
      let spriteFile = path.join(this.projectPath, 'scripts/sprite.js')
      try {
        let spr = await fsprom.readFile(spriteFile, { encoding: 'utf8' })
        this.sprites = JSON.parse(spr.slice(14))
      } catch (err) {
        if (err instanceof SyntaxError) {
          this.showNotif('Error parsing sprite file.')
        } else {
          this.showNotif('Error reading sprite file.')
        }
        this.logError(err)
        success = false
      }
      // convert sprites to base64 strings
      let spriteStrings = Object.keys(this.sprites)
      for (var i = 0; i < spriteStrings.length; i++) {
        let key = spriteStrings[i]
        let value = this.sprites[key]
        this.spriteData[key] = this.base64(value)
      }
      // load items
      let itemFile = path.join(this.projectPath, 'scripts/item.js')
      try {
        let items = await fsprom.readFile(itemFile, { encoding: 'utf8' })
        this.items = JSON.parse(items.slice(12))
      } catch (err) {
        if (err instanceof SyntaxError) {
          this.showNotif('Error parsing item file.')
        } else {
          this.showNotif('Error reading item file.')
        }
        this.logError(err)
        success = false
      }

      // load maps
      let mapFile = path.join(this.projectPath, 'scripts/room.js')
      try {
        let map = await fsprom.readFile(mapFile, { encoding: 'utf8' })
        this.maps = JSON.parse(map.slice(11))
        // unselect any map
        this.selectedMap = ''
      } catch (err) {
        if (err instanceof SyntaxError) {
          this.showNotif('Error parsing map file.')
        } else {
          this.showNotif('Error reading map file.')
        }
        this.logError(err)
        success = false
      }
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
  position: absolute;
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

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
      @select-tile="debuig"
      @change-project-folder="changeProjectFolder"
      @show-error-log="showErrorLog = true"
      @open-npc-editor="currentEditor = 'npc-editor'"
      @create-map="currentEditor = 'new-map-editor'"
      @create-sprite="currentEditor = 'new-sprite-editor'"
    />
    <v-content style="overflow:scroll" app>
      <tile-editor
        v-if="placing"
        :map="computedMap"
        :spritedata="spriteData"
        :blocksize="blocksize"
        :tileset="tilesetData"
        :placingtile="placingtile"
      />
      <room-editor
        v-if="placing == 2"
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
        :npcs="selectedNPCs"
        :map="computedMap"
        :objtype="objtype"
        @open-room-editor="currentEditor = 'no-editor'"
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
import NPC from '@/components/NPC.vue'
import MainControls from '@/components/MainControls.vue'
import NewMapEditor from '@/components/NewMapEditor.vue'
import NewSpriteEditor from '@/components/NewSpriteEditor.vue'
var fs = require('fs')
const fsprom = fs.promises
var path = require('path')
const { app, dialog } = require('electron').remote

export default {
  components: {
    'nav-bar': NavBar,
    'tile-editor': TileEditor,
    'room-editor': RoomEditor,
    'new-map-editor': NewMapEditor,
    'new-sprite-editor': NewSpriteEditor,
    'npc-editor': NPC,
    'no-editor': MainControls
  },
  data() {
    return {
      currentEditor: 'no-editor',
      placing: 2,
      blocksize: 16,
      sprites: {},
      spriteData: {},
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
    debuig(ev) {
      console.log('event ' + ev)
      this.placingtile = ev
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
    addSprite({ name, image }) {
      this.$set(this.sprites, name, image)
      this.$set(this.spriteData, name, this.base64(image))
      this.currentEditor = 'no-editor'
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
          // saving maps
          let maptxt = 'var maps = ' + JSON.stringify(this.maps)
          let mapFile = path.join(this.projectPath, 'scripts/room.js')
          await fsprom.writeFile(mapFile, maptxt)
        } catch (error) {
          this.showNotif('Could not save the project.')
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
</style>

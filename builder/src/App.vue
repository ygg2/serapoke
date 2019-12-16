<template>
  <v-app id="app">
    <nav-bar
      :tileset.sync="tileset"
      :maps="maps"
      :npc.sync="selectedNPC"
      :error="error"
      @save-map="saveStuff"
      @change-project-folder="changeProjectFolder"
      @show-error-log="showErrorLog = true"
    />
    <v-content app>
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/npc">NPC</router-link>
      </div>
      <!-- router view will be showing the block or npc w/script editor -->
      <v-row align="center" justify="center">
        <router-view :selected.sync="selected" :sprites="sprites" />
      </v-row>
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
var fs = require('fs')
const fsprom = fs.promises
var path = require('path')
const { app, dialog } = require('electron').remote

export default {
  components: {
    'nav-bar': NavBar
  },
  data() {
    return {
      sprites: {
        yuu: 'yuu.png'
      },
      maps: {
        testmap: {
          map: [0, 0, 0, 1, 1, 1, 0, 1, 1],
          width: 3,
          height: 3,
          npcs: [
            {
              name: 'Test NPC',
              dialogue: ['some test dialogue', 'more test dialogue'],
              spawn_condition: 'spawn condition',
              image: 'image'
            },
            {
              name: 'Yuu',
              dialogue: ['Need some fries with that?'],
              image: 'yuu'
            }
          ]
        }
      },
      selectedMap: 'testmap',
      selectedNPC: 0,
      tileset: '',
      projectPath: '',
      error: '',
      errorLog: [],
      showErrorLog: false,
      notifVisible: false,
      notif: '',
      notifColor: 'green'
    }
  },
  computed: {
    selected() {
      return this.maps[this.selectedMap].npcs[this.selectedNPC]
    }
  },
  mounted() {
    this.changeProjectFolder()
    this.loadStuff()
  },
  methods: {
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
        // to app.getPath('userData')
        this.showNotif('Set project folder to ' + this.projectPath, false)
        this.loadStuff()
      } else {
        // warn if the user closed the file dialog
        this.error = 'Warning: you must choose a folder.'
      }
    },
    async loadStuff() {
      // load sprites
      let spr
      let spriteFile = path.join(this.projectPath, 'scripts/sprite.js')
      try {
        spr = await fsprom.readFile(spriteFile, { encoding: 'utf8' })
      } catch (err) {
        this.showNotif('Error reading sprite file.')
        this.logError(err)
      }
      try {
        this.sprites = JSON.parse(spr.slice(14))
      } catch (err) {
        this.showNotif('Error parsing sprite file.')
        this.logError(err)
      }
      // load maps
      let map
      let mapFile = path.join(this.projectPath, 'scripts/room.js')
      try {
        map = await fsprom.readFile(mapFile, { encoding: 'utf8' })
      } catch (err) {
        this.showNotif('Error reading map file.')
        this.logError(err)
      }
      try {
        this.maps = JSON.parse(map.slice(11))
      } catch (err) {
        this.showNotif('Error parsing map file.')
        this.logError(err)
      }
      this.showNotif('Successfully loaded.', false)
    },
    // save JSON as js file by appending variable declaration to it
    saveStuff() {
      if (this.projectPath) {
        this.saveSprites()
        this.saveMaps()
      } else {
        this.error = 'Cannot save without a valid project folder.'
      }
    },
    saveSprites() {
      let spritetxt = 'var SPRITES = ' + JSON.stringify(this.sprites)
      let spriteFile = path.join(this.projectPath, 'scripts/sprite.js')
      fs.writeFile(spriteFile, spritetxt, err => {
        if (err) throw err
      })
    },
    saveMaps(savePath) {
      let maptxt = 'var maps = ' + JSON.stringify(this.maps)
      let mapFile = path.join(this.projectPath, 'scripts/room.js')
      fs.writeFile(mapFile, maptxt, err => {
        if (err) throw err
      })
    },
    // thanks @ https://stackoverflow.com/questions/44425495/
    getAppRoot() {
      if (process.platform === 'win32') {
        return path.join(app.getAppPath(), '/../../../')
      } else {
        return path.join(app.getAppPath(), '/../../../../')
      }
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
</style>

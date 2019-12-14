<template>
  <v-app id="app">
    <nav-bar :maps="maps" />
    <v-content>
      <div id="nav">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link>
      </div>
      <!-- router view will be showing the block or npc w/script editor -->
      <router-view :sprites="sprites" :maps="maps" />
    </v-content>
  </v-app>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
var fs = require('fs')
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
      }
    }
  },
  mounted() {
    // loadStuff()
  },
  methods: {
    loadStuff() {
      fs.readFile('../scripts/sprite.js', 'utf8', (err, fd) => {
        if (err) throw err
        this.sprites = JSON.parse(fd.slice(14))
      })
      fs.readFile('../scripts/room.js', 'utf8', (err, fd) => {
        if (err) throw err
        this.maps = JSON.parse(fd.slice(11))
      })
    },
    // save JSON as js file by appending variable declaration to it
    saveSprites() {
      let spritetxt = 'var SPRITES = ' + JSON.stringify(this.sprites)
      fs.writeFile('../scripts/sprite.js', spritetxt, err => {
        if (err) throw err
      })
    },
    saveMaps() {
      let maptxt = 'var maps = ' + JSON.stringify(this.maps)
      fs.writeFile('../scripts/room.js', maptxt, err => {
        if (err) throw err
      })
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

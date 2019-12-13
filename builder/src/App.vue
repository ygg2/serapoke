<template>
  <v-app id="app">
    <v-navigation-drawer permanent app>
      <v-list dense>
        <v-list-item link v-for="(map, name) of maps" :key="name">
          <v-list-item-content>
            {{ name }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-container>
        <v-select :items="Object.keys(maps)" label="Room" dense></v-select>
      </v-container>
    </v-navigation-drawer>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view :sprites="sprites" :maps="maps" />
  </v-app>
</template>

<script>
var fs = require('fs')
export default {
  data() {
    return {
      sprites: {},
      maps: {
        testmap: {
          map: [0, 0, 0, 1, 1, 1, 0, 1, 1],
          width: 3,
          height: 3
        }
      }
    }
  },
  mounted() {
    // load stuff
    fs.readFile('../scripts/sprite.js', 'utf8', (err, fd) => {
      if (err) throw err
      this.sprites = JSON.parse(fd.slice(14))
    })
    fs.readFile('../scripts/room.js', 'utf8', (err, fd) => {
      if (err) throw err
      this.maps = JSON.parse(fd.slice(11))
    })
  },
  methods: {
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
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

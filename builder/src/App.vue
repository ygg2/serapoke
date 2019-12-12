<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
var fs = require("fs");
export default {
  data() {
    return {
      sprites: {}
    };
  },
  mounted() {
    fs.readFile("../scripts/sprite.js", "utf8", (err, fd) => {
      if (err) throw err;
      let spritefile = fd.slice(13);
      this.sprites = JSON.parse(spritefile);
      console.log(spritefile);
      console.log(this.sprites);
    });
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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

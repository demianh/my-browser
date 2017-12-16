<template>
  <div id="app">
    <header>
      <nav-bar></nav-bar>
    </header>
    <div class="content">
      <browser-content></browser-content>
    </div>
    <footer v-if="appState.devtoolsOpen">
      <dev-tools></dev-tools>
    </footer>

    <!--router-view></router-view-->
  </div>
</template>

<script>
  import NavBar from './components/NavBar.vue'
  import BrowserContent from './components/BrowserContent.vue'
  import DevTools from './components/DevTools/DevTools.vue'

  export default {
    components: {
      DevTools,
      NavBar,
      BrowserContent
    },
    data: function() {
      return {
        appState: this.$store.state.App
      }
    },
    name: 'electron-app'
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body, button, td, th {
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 14px;
  }

  #app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }
  .content {
    flex: 1; /* this is the key; consumes all available height */
  }

  a {
    color: #0b97c4;
    cursor: pointer;
  }

  a:hover {
    color: #0f74c4;
  }

  .button {
    padding: 6px 10px;
    background: #0b97c4;
    border: 0;
    border-radius: 5px;
    color: white;
  }


</style>

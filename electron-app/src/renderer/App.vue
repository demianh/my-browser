<template>
  <div id="app" :style="gridStyles">
    <header>
      <nav-bar></nav-bar>
    </header>
    <main class="content" ref="content" @scroll="onScroll">
      <browser-content></browser-content>
    </main>
    <footer v-if="appState.devtoolsOpen">
      <dev-tools></dev-tools>
    </footer>
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
    data: function () {
      return {
        appState: this.$store.state.App
      }
    },
    methods: {
      onScroll() {
        this.$store.commit('SET_SCROLL_POSITION', this.$refs.content.scrollTop || 0)
      }
    },
    computed: {
      gridStyles () {
        return {
          display: 'grid',
          gridTemplateAreas: '"header" "main" "footer"',
          gridTemplateRows: '40px auto ' + (this.appState.devtoolsOpen ? this.appState.devtoolsHeight + 'px' : '0px')
        }
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
    height: 100vh;
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

  .compare-overlay {
    position: absolute;
    background: white;
    width: 100%;
  }

  .compare-overlay webview {
    width: 100%;
    height: 100%;
    display: inline-flex;
  }

  header {
    grid-area: header;
  }
  main {
    grid-area: main;
    overflow: auto;
  }
  footer {
    grid-area: footer;
    z-index: 50;
  }


</style>

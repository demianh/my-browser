<template>
  <div class="nav-bar">
    <div class="nav-bar__left">
      <input type="text" class="nav-bar__url" placeholder="Type URL" v-model="url" @keyup.enter="openUrl()"/>
      <button @click="openUrl()" class="button">Go</button>
    </div>
    <div class="nav-bar__right">
      <a v-if="!appState.devtoolsOpen" @click="$store.dispatch('openDevtools')"><i class="fas fa-cog"></i></a>
      <a v-if="appState.devtoolsOpen" @click="$store.dispatch('closeDevtools')"><i class="fas fa-cog"></i></a>
    </div>
  </div>
</template>

<script>
  import {HtmlParser} from '../../../../js/HtmlParser'
  import {HtmlStyleExtractor} from '../../../../js/HtmlStyleExtractor'

  import {Engine} from '../backend/Engine'

  export default {
    name: 'nav-bar',
    data: function () {
      return {
        url: 'http://localhost/projects/my-browser/resources/demo.html',
        appState: this.$store.state.App
      }
    },
    methods: {
      openUrl () {
        if (this.url.length > 0) {
          let engine = new Engine();
          engine.loadURL(this.url, document.getElementById("canvas"));
        }
      }
    }
  }
</script>

<style scoped>
  .nav-bar {
    background: #fafafa;
    border-bottom: 1px solid #eee;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    position: fixed;
    width: 100%;
    z-index: 1;
  }

  .nav-bar__left {
    float: left;
  }
  .nav-bar__right {
    float: right;
  }

  .nav-bar__url {
    font-size: 15px;
    padding: 6px 12px;
    border-radius: 3px;
    border: 1px solid #aaa;
    width: calc(100vw - 150px);
  }
</style>

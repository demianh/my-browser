<template>
  <div class="nav-bar">
    <div class="nav-bar__left">
      <input type="text" class="nav-bar__url" placeholder="Type URL" v-model="url" @keyup.enter="openUrl()"/>
      <span v-if="appState.isLoading" class="nav-bar__loading"><i class="fas fa-spinner fa-pulse"></i></span>
      <button @click="openUrl()" class="button">Go</button>
    </div>
    <div class="nav-bar__right">
      <a @click="bookmarksOpen = !bookmarksOpen"><i class="fas fa-bookmark"></i></a>&nbsp;
      <div v-if="bookmarksOpen" class="nav-bar__bookmarks-popup">
        <div v-for="bookmark in bookmarks" :key="bookmark.url">
          <a @click="openBookmark(bookmark.url)" :title="bookmark.url" class="nav-bar__bookmark">
            <i class="fas fa-bookmark"></i> {{bookmark.title}}
          </a>
        </div>
      </div>
      <a v-if="!appState.devtoolsOpen" @click="$store.commit('OPEN_DEVTOOLS')"><i class="fas fa-cog"></i></a>
      <a v-if="appState.devtoolsOpen" @click="$store.commit('CLOSE_DEVTOOLS')"><i class="fas fa-cog"></i></a>
    </div>
  </div>
</template>

<script>
  import {Engine} from '../backend/Engine'

  export default {
    name: 'nav-bar',
    data: function () {
      return {
        url: 'http://localhost/projects/my-browser/resources/demo.html',
        appState: this.$store.state.App,
        bookmarksOpen: false,
        bookmarks: [
          {
            title: 'demo.html',
            url: 'http://localhost/projects/my-browser/resources/demo.html'
          },
          {
            title: 'Wikipedia',
            url: 'https://de.wikipedia.org/wiki/Webbrowser'
          },
          {
            title: 'Google',
            url: 'https://www.google.com'
          },
          {
            title: 'Webling',
            url: 'https://www.webling.ch'
          },
          {
            title: 'ACID 1',
            url: 'https://www.w3.org/Style/CSS/Test/CSS1/current/test5526c.htm'
          },
          {
            title: 'ACID 2',
            url: 'http://acid2.acidtests.org/#top'
          },
          {
            title: 'ACID 3',
            url: 'http://acid3.acidtests.org'
          }
        ]
      }
    },
    methods: {
      openBookmark(url) {
          this.url = url;
          this.openUrl();
          this.bookmarksOpen = false;
      },
      openUrl () {
        if (this.url.length > 0) {
          this.$store.commit('SHOW_LOADING')
          this.$nextTick(() => {
            let engine = new Engine()
            engine.loadURL(this.url, document.getElementById('canvas')).then(() => {
              this.$store.commit('HIDE_LOADING')
            })
          })
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
    width: 100%;
    z-index: 1;
  }

  .nav-bar__left {
    float: left;
  }
  .nav-bar__right {
    float: right;
    user-select: none;
  }

  .nav-bar__url {
    font-size: 15px;
    padding: 6px 12px;
    border-radius: 3px;
    border: 1px solid #aaa;
    width: calc(100vw - 150px);
  }

  .nav-bar__loading {
    top: 0;
    right: 150px;
    position: absolute;
  }

  .nav-bar__bookmarks-popup {
    position: absolute;
    background: #fafafa;
    width: 200px;
    right: 26px;
    top: 39px;
    line-height: 25px;
    border-radius: 3px;
    box-shadow: 1px 1px 10px rgba(0,0,0,0.1);
    border: 1px solid #eee;
  }

  .nav-bar__bookmark {
    display: block;
    padding: 3px 10px;
  }

  .nav-bar__bookmark:hover {
    background: #eee;
  }
</style>

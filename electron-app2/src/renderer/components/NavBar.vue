<template>
  <div class="nav-bar">
    <div class="nav-bar__left">
      <input type="text" class="nav-bar__url" placeholder="Type URL" v-model="url" @keyup.enter="openUrl()"/>
      <span v-if="appState.isLoading" class="nav-bar__loading"><hero-icon type="refresh"/></span>
      <button @click="openUrl()" class="button nav-bar__button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="currentColor" style="position: relative; top: 2px">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    <div class="nav-bar__right">
      <a @click="bookmarksOpen = !bookmarksOpen">
        <hero-icon type="bookmark" size="24" top="8"></hero-icon>
      </a>&nbsp;
      <div v-if="bookmarksOpen" class="nav-bar__bookmarks-popup">
        <div v-for="bookmark in bookmarks" :key="bookmark.url">
          <a @click="openBookmark(bookmark.url)" :title="bookmark.url" class="nav-bar__bookmark">
            <hero-icon type="bookmark"></hero-icon>
            {{bookmark.title}}
          </a>
        </div>
      </div>
      <a v-if="!appState.devtoolsOpen" @click="$store.dispatch('OPEN_DEVTOOLS')">
        <hero-icon type="devtools" size="24" top="8"></hero-icon>
      </a>
      <a v-if="appState.devtoolsOpen" @click="$store.dispatch('CLOSE_DEVTOOLS')">
        <hero-icon type="devtools" size="24" top="8"></hero-icon>
      </a>
    </div>
  </div>
</template>

<script>
  import {Engine} from '../backend/Engine'
  import HeroIcon from "./HeroIcon";

  export default {
    name: 'nav-bar',
    components: {HeroIcon},
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
          this.$store.dispatch('SHOW_LOADING')
          this.$store.dispatch('SET_SELECTED_RENDER_TREE_NODE', null)
          this.$nextTick(() => {
            let engine = new Engine()
            engine.loadURL(this.url, document.getElementById('canvas')).then(() => {
              this.$store.dispatch('HIDE_LOADING')
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
    border-radius: 6px;
    border: 2px solid #ddd;
    width: calc(100vw - 130px);
  }

  .nav-bar__loading {
    top: 0;
    right: 130px;
    position: absolute;
  }

  .nav-bar__button {
    cursor: pointer;
  }

  .nav-bar__bookmarks-popup {
    position: absolute;
    z-index: 100;
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

  .nav-bar__icon {
    margin-top: 8px;
    width: 24px;
    height: 24px;
  }
</style>

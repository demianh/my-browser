<template>
  <div
          class="dev-tools"
          @mousemove="onMouseMove"
          @mouseup="isResizing = false"
          @mouseleave="isResizing = false"
  >
    <div class="dev-tools__menu">
      Dev Tools
      &nbsp;&nbsp;|&nbsp;
      <a @click="tab = 'html'" class="dev-tools__tab" :class="{'dev-tools__tab--selected': tab === 'html'}">HTML</a>
      <a @click="tab = 'css'" class="dev-tools__tab" :class="{'dev-tools__tab--selected': tab === 'css'}">CSS</a>
      <a @click="tab = 'layout'" class="dev-tools__tab" :class="{'dev-tools__tab--selected': tab === 'layout'}">LayoutTree</a>
      <a @click="tab = 'debug'" class="dev-tools__tab" :class="{'dev-tools__tab--selected': tab === 'debug'}">Debug</a>

      <span class="dev-tools__menu_buttons">
        <a @click="$store.dispatch('CLOSE_DEVTOOLS')" class="dev-tools__close"><hero-icon type="close" /></a>
      </span>
      <div class="dev-tools__resizer" :class="{'dev-tools__resizer--resizing': isResizing}" @mousedown="isResizing = true"></div>
    </div>
    <div class="dev-tools__tabarea">
      <div class="dev-tools__content" v-if="tab === 'html'">
        <html-tree :nodes="document.html"></html-tree>
      </div>
      <div class="dev-tools__content" v-if="tab === 'css'">
        <css-tree :nodes="document.css"></css-tree>
      </div>
      <div class="dev-tools__content-divided" v-if="tab === 'layout'">
        <div class="dev-tools__content-divided__main" :style="{height: (height - 30) + 'px'}">
          <render-tree :nodes="document.layoutTree"></render-tree>
        </div>
        <div class="dev-tools__content-divided__sidebar" :style="{height: (height - 30) + 'px'}">
          <render-tree-node-info></render-tree-node-info>
        </div>
      </div>
      <div class="dev-tools__content" v-if="tab === 'debug'">
        <br>
        <label><input type="checkbox" v-model="showDebugLayers"> Show Debug Layers</label>
        <br><br>
        Compare with Chrome Rendering: <input type="range" min="0" max="100" v-model="compareOverlayOpacity" class="dev-tools__compare-input"> Opacity: {{compareOverlayOpacity}}%
      </div>
    </div>
  </div>
</template>

<script>
    import HtmlTree from './HtmlTree.vue'
    import CssTree from './CssTree.vue'
    import RenderTree from './RenderTree.vue'
    import RenderTreeNodeInfo from './RenderTreeNodeInfo.vue'
    import HeroIcon from "../HeroIcon";

export default {
      components: {
        HeroIcon,
        RenderTreeNodeInfo,
        HtmlTree,
        CssTree,
        RenderTree
      },
      name: 'dev-tools',
      data: function () {
        return {
          tab: 'layout',
          isResizing: false,
          document: this.$store.state.Document,
          app: this.$store.state.App
        }
      },
      computed: {
        height: {
          get () {
            return this.app.devtoolsHeight
          },
          set (value) {
            this.$store.dispatch('SET_DEVTOOLS_HEIGHT', value)
          }
        },
        showDebugLayers: {
          get () {
            return this.app.showDebugLayers
          },
          set (value) {
            this.$store.dispatch('SET_SHOW_DEBUG_LAYERS', value)
          }
        },
        compareOverlayOpacity: {
          get () {
            return this.app.compareOverlayOpacity
          },
          set (value) {
            this.$store.dispatch('SET_COMPARE_OVERLAY_OPACITY', value)
          }
        }
      },
      methods: {
        onMouseMove (event) {
          if (this.isResizing) {
            // pause event to prevent text selection while dragging
            this.pauseEvent(event)
            // set new height
            if (this.height > 50 || event.movementY < 0) {
              this.height = this.height - event.movementY
            }
          }
        },
        pauseEvent (e) {
          // stop event propagation
          if (e.stopPropagation) {
            e.stopPropagation()
          }
          if (e.preventDefault) {
            e.preventDefault()
          }
          e.cancelBubble = true
          e.returnValue = false
          return false
        }
      }
    }
</script>

<style scoped>
  .dev-tools {
    overflow: auto;
    width: 100%;
    height: 100%;
    background: white;
  }

  .dev-tools__menu  {
    background: #fafafa;
    border-top: 1px solid #bbb;
    border-bottom: 1px solid #ddd;
    padding: 5px;
    position: absolute;
    width: 100%;
    z-index: 10;
    user-select: none;
  }

  .dev-tools__menu_buttons {
    float: right;
  }

  .dev-tools__compare-input {
    height: 10px;
  }

  .dev-tools__close {
    display: inline-block;
    font-weight: bold;
    width: 20px;
    text-align: center;
  }

  .dev-tools__tab {
    display: inline-block;
    padding: 0 5px;
  }

  .dev-tools__tab--selected {
    background: #0b97c4;
    color: white;
    border-radius: 2px;
  }

  .dev-tools__resizer {
    height: 7px;
    width: 100%;
    cursor: ns-resize;
    position: absolute;
    margin-top: -25px;
    left: 0;
  }

  .dev-tools__resizer--resizing {
    height: 100vh;
    position: fixed;
    margin-top: 0;
    top: 0;
  }

  .dev-tools__tabarea {
    padding-top: 30px;
  }

  .dev-tools__content {
    padding: 5px;
  }

  .dev-tools__content-divided {
    display: grid;
    grid-template-columns: 66.667% 33.333%;
  }
  .dev-tools__content-divided__main {
    padding: 5px;
    overflow: auto;
  }
  .dev-tools__content-divided__sidebar {
    padding: 5px;
    overflow: auto;
    border-left: 1px solid #ddd;
  }
</style>

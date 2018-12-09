<template>
  <div
          class="dev-tools"
          @mousemove="onMouseMove"
          @mouseup="isResizing = false"
          @mouseleave="isResizing = false"
          :style="{height: height + 'px'}"
  >
    <div class="dev-tools__menu">
      Dev Tools
      &nbsp;&nbsp;|&nbsp;
      <a @click="tab = 'html'" class="dev-tools__tab" :class="{'dev-tools__tab--selected': tab === 'html'}">HTML</a>
      <a @click="tab = 'css'" class="dev-tools__tab" :class="{'dev-tools__tab--selected': tab === 'css'}">CSS</a>
      <a @click="tab = 'render'" class="dev-tools__tab" :class="{'dev-tools__tab--selected': tab === 'render'}">RenderTree</a>

      <span class="dev-tools__menu_buttons">
        Compare: <input type="range" min="0" max="100" v-model="compareOverlayOpacity" class="dev-tools__compare-input">&nbsp;&nbsp;
        <label><input type="checkbox" v-model="showDebugLayers"> Show Debug Layers</label>&nbsp;&nbsp;
        <a @mousedown="isResizing = true"><i class="fas fa-arrows-alt-v"></i></a>
        <a @click="$store.commit('CLOSE_DEVTOOLS')" class="dev-tools__close"><i class="fas fa-times"></i></a>
      </span>
    </div>
    <div class="dev-tools__tabarea">
      <div class="dev-tools__content" v-if="tab === 'html'">
        <html-tree :nodes="document.html"></html-tree>
      </div>
      <div class="dev-tools__content" v-if="tab === 'css'">
        <css-tree :nodes="document.css"></css-tree>
      </div>
      <div class="dev-tools__content-divided" v-if="tab === 'render'">
        <div class="dev-tools__content-divided__main" :style="{height: (height - 30) + 'px'}">
          <render-tree :nodes="document.renderTree"></render-tree>
        </div>
        <div class="dev-tools__content-divided__sidebar" :style="{height: (height - 30) + 'px'}">
          <render-tree-node-info></render-tree-node-info>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import HtmlTree from './HtmlTree.vue'
    import CssTree from './CssTree.vue'
    import RenderTree from './RenderTree.vue'
    import RenderTreeNodeInfo from './RenderTreeNodeInfo.vue'

export default {
      components: {
        RenderTreeNodeInfo,
        HtmlTree,
        CssTree,
        RenderTree
      },
      name: 'dev-tools',
      data: function () {
        return {
          tab: 'render',
          height: 300,
          isResizing: false,
          document: this.$store.state.Document,
          app: this.$store.state.App
        }
      },
      computed: {
        showDebugLayers: {
          get () {
            return this.app.showDebugLayers
          },
          set (value) {
            this.$store.commit('SET_SHOW_DEBUG_LAYERS', value)
          }
        },
        compareOverlayOpacity: {
          get () {
            return this.app.compareOverlayOpacity
          },
          set (value) {
            this.$store.commit('SET_COMPARE_OVERLAY_OPACITY', value)
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
    position: fixed;
    bottom: 0;
    width: 100%;
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

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
      <a @click="tab = 'html'" class="dev-tools__tab" :class="{'dev-tools__tab--selected': tab == 'html'}">HTML</a>
      <a @click="tab = 'css'" class="dev-tools__tab" :class="{'dev-tools__tab--selected': tab == 'css'}">CSS</a>
      <a @click="tab = 'render'" class="dev-tools__tab" :class="{'dev-tools__tab--selected': tab == 'render'}">RenderTree</a>

      <span class="dev-tools__menu_buttons">
        <a @mousedown="isResizing = true"><i class="fas fa-arrows-alt-v"></i></a>
        <a @click="$store.dispatch('closeDevtools')" class="dev-tools__close"><i class="fas fa-times"></i></a>
      </span>
    </div>
    <div class="dev-tools__tabarea">
      <div class="dev-tools__content" v-if="tab=='html'">
        <html-tree :nodes="document.html"></html-tree>
      </div>
      <div class="dev-tools__content" v-if="tab=='css'">
        {{document.css}}
      </div>
      <div class="dev-tools__content" v-if="tab=='render'">RenderTree</div>
    </div>
  </div>
</template>

<script>
    import HtmlTree from './HtmlTree.vue'

export default {
      components: {HtmlTree},
      name: 'dev-tools',
      data: function () {
        return {
          tab: 'html',
          height: 300,
          isResizing: false,
          document: this.$store.state.Document
        }
      },
      methods: {
        onMouseMove (event) {
          if (this.isResizing) {
            // pause event to prevent text selection while dragging
            this.pauseEvent(event)
            // set new height
            this.height = this.height - event.movementY
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
    overflow: scroll;
  }

  .dev-tools__menu  {
    background: #fafafa;
    border-top: 1px solid #bbb;
    border-bottom: 1px solid #ddd;
    padding: 5px;
    position: absolute;
    width: 100%;
    z-index: 10;
  }

  .dev-tools__menu_buttons {
    float: right;
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
</style>

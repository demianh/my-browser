<template>
  <div class="browser-content" ref="content">
    <div class="inspected-element" :style="inspectedElementStyle"></div>
    <div class="compare-overlay" v-if="app.compareOverlayOpacity > 0" :style="{ opacity: app.compareOverlayOpacity / 100 }">
      <webview id="fcompare-webview" :src="app.url" autosize="on"></webview>
    </div>
    <canvas id="canvas" :width="width * 2" :height="200" :style="{width: width + 'px'}"></canvas>
  </div>
</template>

<script>
  import {Engine} from '../backend/Engine'
  import debounce from 'lodash/debounce'

  export default {
    name: 'browser-content',
    data: function () {
      return {
        width: 600,
        app: this.$store.state.App,
        isRepainting: false,
        debounce: null
      }
    },
    computed: {
      node () {
        return this.app.selectedLayoutTreeNode
      },
      inspectedElementStyle() {
        let base = {
          border: '1px solid red',
          width: '0',
          height: '0',
          marginTop: '0',
          left: '-10px',
          position: 'absolute',
          'pointer-events': 'none',
          transition: 'all 0.3s ease-out'
        }
        if (this.node) {
          base.width = this.node.width + 'px'
          base.height = this.node.height + 'px'
          base.marginTop = (this.node.top - this.app.scrollPosition) + 'px'
          base.left = this.node.left + 'px'
        }
        return base;
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      onResize() {
        this.resizeContentArea()
        if (this.debounce !== null) {
          this.debounce.cancel();
        }
        this.debounce = debounce(() => { this.repaint() }, 300);
        this.debounce();
      },
      resizeContentArea () {
        if (this.$refs.content) {
          this.width = this.$refs.content.clientWidth
        }
      },
      repaint() {
        if (!this.isRepainting && !this.app.isLoading) {
          if (this.$store.state.Document.renderTree) {
            this.isRepainting = true;
            this.$store.dispatch('SHOW_LOADING')
            let engine = new Engine()
            engine.repaint(this.$store.state.Document.renderTree, document.getElementById('canvas'));
            this.$store.dispatch('HIDE_LOADING')
            this.isRepainting = false;
          }
        }
      }
    },
    mounted () {
      this.resizeContentArea()
      window.addEventListener('resize', this.onResize, true)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.onResize, true)
    }
  }
</script>

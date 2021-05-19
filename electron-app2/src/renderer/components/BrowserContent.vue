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
  export default {
    name: 'browser-content',
    data: function () {
      return {
        width: 600,
        app: this.$store.state.App,
      }
    },
    computed: {
      node () {
        return this.app.selectedRenderTreeNode
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
      resizeContentArea () {
        if (this.$refs.content) {
          this.width = this.$refs.content.clientWidth
        }
      }
    },
    mounted () {
      this.resizeContentArea()
      window.addEventListener('resize', () => {
        this.resizeContentArea()
      }, true)
    }
  }
</script>

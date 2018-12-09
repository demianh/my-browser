<template>
  <div class="browser-content" ref="content">
    <div class="inspected-element" :style="inspectedElementStyle"></div>
    <div class="compare-overlay" v-if="app.compareOverlayOpacity > 0" :style="{ opacity: app.compareOverlayOpacity / 100 }">
      <webview id="fcompare-webview" :src="app.url"></webview>
    </div>
    <canvas id="canvas" :width="width * 2" :height="height * 2" :style="{width: width + 'px', height: height + 'px'}"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'browser-content',
    data: function () {
      return {
        width: 600,
        height: 1000,
        app: this.$store.state.App,
        inspectedElementStyle: {
          border: '1px solid red',
          width: '0',
          height: '0',
          marginTop: '0',
          left: '-10px',
          position: 'absolute'
        }
      }
    },
    computed: {
      node () {
        return this.app.selectedRenderTreeNode
      }
    },
    watch: {
      node: function (node) {
        if (node) {
          this.inspectedElementStyle.width = node.width + 'px'
          this.inspectedElementStyle.height = node.height + 'px'
          this.inspectedElementStyle.marginTop = node.top + 'px'
          this.inspectedElementStyle.left = node.left + 'px'
        } else {
          this.inspectedElementStyle.width = '0px'
          this.inspectedElementStyle.height = '0px'
          this.inspectedElementStyle.marginTop = '0px'
          this.inspectedElementStyle.left = '-10px'
        }
      }
    },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      resizeContentArea () {
        this.width = this.$refs.content.clientWidth
        this.height = this.$refs.content.clientHeight
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

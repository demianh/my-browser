<template>
  <div class="render-tree-node-info">
    <div v-if="node">
      <h3>Node Info &lt;{{node.tag}}&gt;</h3>
      <table>
        <tr><th>Type</th><td>{{node.type}}</td></tr>
        <tr><th>ID</th><td>{{node.id}}</td></tr>
        <tr><th>Classes</th><td>{{node.classNames.join(', ')}}</td></tr>
      </table>

      <h3>Styles</h3>
      <div v-for="style in node.styles">
        <css-tree-node :node="style"></css-tree-node>
      </div>
    </div>
  </div>
</template>

<script>
    import CssTreeNode from "./CssTreeNode.vue";

    export default {
        components: {CssTreeNode},
        name: 'render-tree-node-info',
      created: function () {
        if (this.depth <= 1) {
          this.open = true
        }
      },
      computed: {
        node () {
          return this.app.selectedRenderTreeNode
        }
      },
      data: function () {
        return {
          open: false,
          app: this.$store.state.App
        }
      }
    }
</script>

<style scoped>
  h3 {
    margin-bottom: 6px;
    margin-top: 10px;
    color: #888;
  }

  th, td {
    font-family: monospace;
    font-size: 12px;
  }

  th {
    text-align: left;
  }

</style>

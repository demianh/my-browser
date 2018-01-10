<template>
  <div class="render-tree-node-info">
    <div v-if="node">
      <h3>Node Info &lt;{{node.tag}}&gt;</h3>
      <table>
        <tr><th>ID</th><td>{{node.id}}</td></tr>
        <tr><th>Classes</th><td>{{node.classNames.join(', ')}}</td></tr>
      </table>

      <h3>Styles ({{node.styles.length}})</h3>
      <div v-for="style in node.styles" class="render-tree-node-info__styles">
        <css-rule-name :rule="style"></css-rule-name>
        <span class="render-tree-node-info__specificity">[{{style.specificity.join(',')}}]</span>
        {
        <div class="render-tree-node-info__style_declarations">
          <css-rule-declarations :declarations="style.declarations"></css-rule-declarations>
        </div>
        <div>}</div>
      </div>
    </div>
  </div>
</template>

<script>
    import CssRuleDeclarations from "./CssRuleDeclarations.vue";
    import CssRuleName from './CssRuleName.vue'

    export default {
      components: {CssRuleDeclarations, CssRuleName},
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
    padding-right: 10px;
  }

  .render-tree-node-info__specificity {
    color: #aaa;
  }

  .render-tree-node-info__styles {
    font-family: monospace;
    font-size: 12px;
  }

  .render-tree-node-info__style_declarations {
    padding-left: 25px;
  }

</style>

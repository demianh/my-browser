<template>
  <div class="render-tree-node-info">
    <div v-if="node">
      <h3>Node Info &lt;{{node.tag}}&gt;</h3>
      <table>
        <tr>
          <th>ID</th>
          <td>
            <span v-if="node.id">#{{node.id}}</span>
          </td>
        </tr>
        <tr>
          <th>Classes</th>
          <td>
            <span v-if="node.classNames.length">.{{node.classNames.join(', .')}}</span>
          </td>
        </tr>
        <tr>
          <th>Measures</th>
          <td>
            width: {{node.width}}px, height: {{node.height}}px
          </td>
        </tr>
        <tr>
          <th>Position</th>
          <td>
            top: {{node.top}}px, left: {{node.left}}px
          </td>
        </tr>
        <tr>
          <th>Display</th>
          <td>
            <span v-if="node.computedStyles.display">{{node.computedStyles.display[0].value}}</span>
          </td>
        </tr>
        <tr v-if="node.type === 'text'">
          <th>Text Lines</th>
          <td>
            <span>{{node.textLines.length}}</span>
          </td>
        </tr>
      </table>

      <h3>Styles ({{node.styles.length}})</h3>
      <div v-for="style in reversedStyles" class="render-tree-node-info__styles">
        <css-rule-name :rule="style"></css-rule-name>
        <span class="render-tree-node-info__specificity">[{{style.specificity.join(',')}}]</span>
        {
        <div class="render-tree-node-info__style_declarations">
          <css-rule-declarations :declarations="style.declarations"></css-rule-declarations>
        </div>
        <div>}</div>
      </div>

      <h3>Computed Styles</h3>
      <div v-for="(computed, key) in node.computedStyles" class="render-tree-node-info__computed">
        <span class="css-rule-declarations__key">{{key}}</span>:
        <span class="css-rule-declarations__value" v-for="(keyword, index) in computed"><!--
          --><span v-if="index > 0">&nbsp;</span><!--
          --><span v-if="keyword.type == 'unit'" class="css-rule-declarations__unit">{{keyword.value}}<i>{{keyword.unit}}</i></span><!--
          --><span v-if="keyword.type == 'keyword'" class="css-rule-declarations__keyword">{{keyword.value}}</span><!--
          --><span v-if="keyword.type == 'color'" class="css-rule-declarations__color">{{keyword.value}}</span><!--
          --><span v-if="keyword.type == 'function'" class="css-rule-declarations__function">{{keyword.value}}({{keyword.arguments}})</span><!--
        --></span>;
      </div>

    </div>
  </div>
</template>

<script>
    import CssRuleDeclarations from './CssRuleDeclarations.vue'
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
          return this.app.selectedLayoutTreeNode
        },
        reversedStyles () {
          return this.node.styles.slice().reverse()
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

  .render-tree-node-info__computed {
    font-family: monospace;
    font-size: 12px;
  }


  .css-rule-declarations__key {
    color: #0b97c4;
  }
  .css-rule-declarations__value {

  }
  .css-rule-declarations__color {
    color: blueviolet;
  }

  .css-rule-declarations__unit {
    color: #00d6b2;
  }

  .css-rule-declarations__function {
    color: #63002d;
  }
</style>

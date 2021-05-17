<template>
  <div class="css-tree-node">
    <span v-if="node.type == 'at'">
      <span class="css-tree-node__at-rule">
        <span class="css-tree-node__at">@{{node.at}}</span> <span>{{node.selector}} {</span>
        <div v-for="(rule, key) in node.styles" class="css-tree-node__at-style">
          <css-tree-node :node="rule"></css-tree-node>
        </div>
      </span>
      <div class="css-tree-node__end">}</div>
    </span>
    <span v-else>
      <span class="css-tree-node__opener" @click="open = !open">
        <span v-if="open" class="css-tree-node__open"><hero-icon type="minus" /></span>
        <span v-if="!open" class="css-tree-node__close"><hero-icon type="plus" /></span>
      </span>
      <span v-if="node.type == 'comment'" class="css-tree-node__comment">
        <span v-if="!open">/*{{node.content.substr(0, 140)}}*/</span>
        <span v-if="open">/*{{node.content}}*/</span>
      </span>
      <span v-else>
        <span v-for="(rule, index) in node.rules">
          <span v-if="index > 0">,</span>
          <css-rule-name :rule="rule"></css-rule-name>
        </span>
        <span v-if="!open && node.declarations" class="css-tree-node__rulecount">{ {{node.declarations.length}} }</span>
        <span v-if="open">{</span>
        <div v-if="open" class="css-tree-node__declarations">
          <css-rule-declarations :declarations="node.declarations"></css-rule-declarations>
        </div>
        <div v-if="open" class="css-tree-node__end">}</div>
      </span>
    </span>
  </div>
</template>

<script>
    import CssRuleDeclarations from './CssRuleDeclarations.vue'
    import CssRuleName from './CssRuleName.vue'
    import HeroIcon from "../HeroIcon";

    export default {
      name: 'css-tree-node',
      props: ['node'],
      components: {HeroIcon, CssRuleDeclarations, CssRuleName},
      data: function () {
        return {
          open: false
        }
      }
    }
</script>

<style scoped>
  .css-tree-node {
    font-family: monospace;
    font-size: 12px;
  }

  .css-tree-node__opener {
    display: inline-block;
    width: 20px;
    text-align: center;
  }

  .css-tree-node__open,
  .css-tree-node__close {
    cursor: pointer;
    display: inline-block;
    width: 20px;
  }

  .css-tree-node__rulecount {
    color: #bbb;
    font-style: italic;
  }

  .css-tree-node__declarations {
    padding-left: 45px;
  }

  .css-tree-node__comment {
    color: #666;
  }

  .css-tree-node__at {
    font-weight: bold;
    color: darkgreen;
  }

  .css-tree-node__at-style {
    padding-left: 20px;
  }

  .css-tree-node__at-rule {
    padding-left: 26px;
  }

  .css-tree-node__end {
    padding-left: 26px;
  }

</style>

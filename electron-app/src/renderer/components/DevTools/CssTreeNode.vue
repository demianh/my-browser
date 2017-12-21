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
        <span v-if="open" class="css-tree-node__open"><i class="far fa-minus-square"></i></span>
        <span v-if="!open" class="css-tree-node__close"><i class="far fa-plus-square"></i></span>
      </span>
      <span v-for="(rule, index) in node.rules">
        <span v-if="index > 0">,</span>
        <span v-for="selector in rule.selectors"><!--
          --><span v-if="selector.combinator !== 'same' && selector.combinator !== 'root'">&nbsp;</span><!--
          --><span v-if="selector.combinator == 'child'" class="css-tree-node__combinator">&gt;&nbsp;</span><!--
          --><span v-if="selector.combinator == 'adjacent'" class="css-tree-node__combinator">+&nbsp;</span><!--
          --><span v-if="selector.combinator == 'sibling'" class="css-tree-node__combinator">~&nbsp;</span><!--
          --><span v-if="selector.type == 'element'" class="css-tree-node__element">{{selector.selector}}</span><!--
          --><span v-if="selector.type == 'class'" class="css-tree-node__class">.{{selector.selector}}</span><!--
          --><span v-if="selector.type == 'id'" class="css-tree-node__id">#{{selector.selector}}</span><!--
          --><span v-if="selector.type == 'attribute'" class="css-tree-node__attribute">[{{selector.selector}}]</span><!--
          --><span v-if="selector.type == 'pseudo-element'" class="css-tree-node__pseudo-element">::{{selector.selector}}</span><!--
          --><span v-if="selector.type == 'pseudo-class'" class="css-tree-node__pseudo-class">:{{selector.selector}}</span><!--
          --><span v-if="selector.arguments && selector.arguments.length" class="css-tree-node__parentheses">(<!--
              --><span class="css-tree-node__arguments">{{selector.arguments}}</span><!--
          -->)</span><!--
        --></span>
      </span>
      <span v-if="!open && node.declarations" class="css-tree-node__rulecount">{ {{node.declarations.length}} }</span>
      <span v-if="open">{</span>
      <div v-if="open" class="css-tree-node__declarations">
        <div v-for="decl in node.declarations">
          <span class="css-tree-node__declarations-key">{{decl.name}}</span>:
          <span class="css-tree-node__declarations-value">{{decl.value}}</span>;
        </div>
      </div>
      <div v-if="open" class="css-tree-node__end">}</div>
    </span>
  </div>
</template>

<script>
    export default {
      name: 'css-tree-node',
      props: ['node'],
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

  .css-tree-node__element {
    font-weight: bold;
    color: darkgreen;
  }

  .css-tree-node__id {
    font-weight: bold;
    color: darkblue;
  }

  .css-tree-node__class {
    font-weight: bold;
    color: #63002d;
  }

  .css-tree-node__pseudo-class,
  .css-tree-node__pseudo-element {
    font-weight: bold;
    color: #903400;
  }

  .css-tree-node__parentheses {
    font-weight: bold;
    color: #903400;
  }

  .css-tree-node__attribute,
  .css-tree-node__arguments {
    font-weight: bold;
    color: #333;
  }

  .css-tree-node__rulecount {
    color: #bbb;
    font-style: italic;
  }

  .css-tree-node__declarations {
    padding-left: 45px;
  }

  .css-tree-node__declarations-key {
    color: #0b97c4;
  }
  .css-tree-node__declarations-value {

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

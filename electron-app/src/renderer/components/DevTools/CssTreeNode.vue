<template>
  <div class="css-tree-node">
    <span class="css-tree-node__opener" @click="open = !open">
      <span v-if="open" class="css-tree-node__open"><i class="far fa-minus-square"></i></span>
      <span v-if="!open" class="css-tree-node__close"><i class="far fa-plus-square"></i></span>
    </span>
    <span v-for="rule in node.rules">
      <span v-for="selector in rule.selectors"><!--
        --><span v-if="selector.combinator !== 'same'">&nbsp;</span><!--
        --><span v-if="selector.combinator == 'child'">&gt;&nbsp;</span><!--
        --><span v-if="selector.combinator == 'adjacent'">+&nbsp;</span><!--
        --><span v-if="selector.combinator == 'sibling'">~&nbsp;</span><!--
        --><span v-if="selector.type == 'element'">{{selector.selector}}</span><!--
        --><span v-if="selector.type == 'class'">.{{selector.selector}}</span><!--
        --><span v-if="selector.type == 'id'">#{{selector.selector}}</span><!--
        --><span v-if="selector.type == 'pseudo-element'">::{{selector.selector}}</span><!--
        --><span v-if="selector.type == 'pseudo-class'">:{{selector.selector}}</span><!--
      --></span>
    </span>
    <div v-if="open">
      {{node}}<br>
      {{node.declarations}}
    </div>
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

</style>

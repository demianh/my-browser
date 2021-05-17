<template>
  <span class="css-rule-name">
      <span v-for="selector in rule.selectors"><!--
        --><span v-if="selector.inline == true" class="css-tree-node__inline">Inline Styles</span><!--
        --><span v-if="selector.combinator !== 'root'">&nbsp;</span><!--
        --><span v-if="selector.combinator == 'child'" class="css-tree-node__combinator">&gt;&nbsp;</span><!--
        --><span v-if="selector.combinator == 'adjacent'" class="css-tree-node__combinator">+&nbsp;</span><!--
        --><span v-if="selector.combinator == 'sibling'" class="css-tree-node__combinator">~&nbsp;</span><!--
        --><span v-if="selector.element" class="css-tree-node__element">{{selector.element}}</span><!--
        --><span v-if="selector.ids"><span v-for="id in selector.ids" class="css-tree-node__id">#{{id}}</span></span><!--
        --><span v-if="selector.classes"><span v-for="cls in selector.classes" class="css-tree-node__class">.{{cls}}</span></span><!--
        --><span v-if="selector.attributes"><span v-for="att in selector.attributes" class="css-tree-node__attribute">[{{att}}]</span></span><!--
        --><span v-if="selector.pseudoClasses"><span v-for="cls in selector.pseudoClasses" class="css-tree-node__pseudo-class">:{{cls}}</span></span><!--
        --><span v-if="selector.pseudoElements"><span v-for="el in selector.pseudoElements" class="css-tree-node__pseudo-element">::{{el}}</span></span><!--
        --><span v-if="selector.functions"><span v-for="func in selector.functions" class="css-tree-node__parentheses">:{{func.name}}(<!--
            --><span class="css-tree-node__arguments">{{func.arguments}}</span><!--
        -->)</span></span><!--
      --></span>
  </span>
</template>

<script>
    export default {
      name: 'css-rule-name',
      props: ['rule']
    }
</script>

<style scoped>
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

  .css-tree-node__inline {
    color: #555;
    font-style: italic;
  }

</style>

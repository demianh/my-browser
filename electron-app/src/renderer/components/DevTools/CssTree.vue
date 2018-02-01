<template>
  <div class="css-tree">
    <div v-for="(source, key) in nodes">
      <div class="css-tree__source-title">
        <span v-if="source.type == 'inline'">Inline Styles:</span>
        <span v-if="source.type == 'browser'">Browser Default Styles:</span>
        <span v-if="source.type == 'link'">Linked Style: {{source.href}}</span>
      </div>
      <div v-for="(rule, key2) in source.cssTree">
        <css-tree-node :node="rule"></css-tree-node>
      </div>
    </div>
  </div>
</template>

<script>
    import CssTreeNode from './CssTreeNode.vue'

    export default {
      name: 'css-tree',
      components: {CssTreeNode},
      props: ['nodes'],
      data: function () {
        return {
          open: false
        }
      }
    }
</script>

<style scoped>
  .css-tree {

  }

  .css-tree__source-title {
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 5px;
    color: midnightblue;
  }

</style>

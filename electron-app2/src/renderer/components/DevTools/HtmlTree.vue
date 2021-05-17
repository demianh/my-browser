<template>
  <div class="html-tree">
    <div v-for="(node, key) in nodes">
      <html-tree-node :node="node" :depth="0"></html-tree-node>
    </div>
  </div>
</template>

<script>
    import HtmlTreeNode from './HtmlTreeNode.vue'

    export default {
      name: 'html-tree',
      components: {HtmlTreeNode},
      props: ['nodes'],
      data: function () {
        return {
          open: false
        }
      }
    }
</script>

<style scoped>
  .html-tree {

  }

</style>

<template>
  <div class="render-tree">
    <div v-for="(node, key) in nodes">
      <render-tree-node :node="node" :depth="0"></render-tree-node>
    </div>
  </div>
</template>

<script>
    import RenderTreeNode from './RenderTreeNode.vue'

    export default {
      name: 'render-tree',
      components: {RenderTreeNode},
      props: ['nodes'],
      data: function () {
        return {
          open: false
        }
      }
    }
</script>

<style scoped>
  .render-tree {}
</style>

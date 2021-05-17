<template>
  <div class="render-tree-node" :class="{'render-tree-node--selected': app.selectedRenderTreeNode === node}">
    <div class="render-tree-node__label" @click="$store.dispatch('SET_SELECTED_RENDER_TREE_NODE', node)">
      <span class="render-tree-node__opener" @click="open = !open">
        <span v-if="node.children && node.children.length">
          <span v-if="open" class="render-tree-node__open"><hero-icon type="minus" /></span>
          <span v-if="!open" class="render-tree-node__close"><hero-icon type="plus" /></span>
        </span>
      </span>
      <span v-if="node.type == 'element'" class="render-tree-node__element">
        &lt;<span class="render-tree-node__tag">{{node.tag}}</span><!--
        --><span v-for="(value, key) in node.attributes" class="render-tree-node__attribute"><span class="render-tree-node__att-key"> {{key}}</span>="<span class="render-tree-node__att-val">{{value}}</span>"</span><!--
        -->&gt;
      </span>
      <span v-if="node.type == 'text'" class="render-tree-node__text">
        "{{node.content}}"
      </span>
      <span v-if="node.type == 'comment'" class="render-tree-node__comment">
        &lt;!--{{node.content}}--&gt;
      </span>
      <span v-if="node.type == 'doctype'" class="render-tree-node__doctype">
        &lt;!DOCTYPE<!--
        --><span v-for="(value, key) in node.params" class="render-tree-node__param"> {{value}}</span><!--
        -->&gt;
      </span>
    </div>
    <div v-if="open && node.children && node.children.length" class="render-tree-node__children">
      <div v-for="child in node.children">
        <render-tree-node :node="child" :depth="depth + 1"></render-tree-node>
      </div>
    </div>
  </div>
</template>

<script>
    import HeroIcon from "../HeroIcon";
    export default {
      name: 'render-tree-node',
      components: {HeroIcon},
      props: ['node', 'depth'],
      created: function () {
        if (this.depth <= 1) {
          this.open = true
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
  .render-tree-node {
    font-family: monospace;
    font-size: 12px;
  }

  .render-tree-node__label {
    cursor: default;
  }

  .render-tree-node--selected > .render-tree-node__label {
    background: #e1ecff;
    border-radius: 2px;
  }

  .render-tree-node__opener {
    display: inline-block;
    width: 20px;
    text-align: center;
  }

  .render-tree-node__children {
    padding-left: 20px;
  }

  .render-tree-node__doctype {
    color: #555;
    font-weight: bold;
  }

  .render-tree-node__text {
    color: #888;
  }

  .render-tree-node__element {
    color: #555;
    font-weight: bold;
  }

  .render-tree-node__comment {
    color: green;
  }

  .render-tree-node__tag {
    font-weight: bold;
    color: #520029;
  }

  .render-tree-node__attribute {
    font-weight: bold;
  }

  .render-tree-node__att-key {
    color: brown;
  }

  .render-tree-node__att-val {
    color: blue;
  }

  .render-tree-node__open,
  .render-tree-node__close {
    cursor: pointer;
    display: inline-block;
    width: 20px;
  }

</style>

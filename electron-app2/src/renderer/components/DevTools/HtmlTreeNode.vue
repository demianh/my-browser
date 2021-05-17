<template>
  <div class="html-tree-node">
    <span class="html-tree-node__opener" @click="open = !open">
      <span v-if="node.children && node.children.length">
        <span v-if="open" class="html-tree-node__open"><hero-icon type="minus" /></span>
        <span v-if="!open" class="html-tree-node__close"><hero-icon type="plus" /></span>
      </span>
    </span>
    <span v-if="node.type == 'element'" class="html-tree-node__element">
      &lt;<span class="html-tree-node__tag">{{node.tag}}</span><!--
      --><span v-for="(value, key) in node.attributes" class="html-tree-node__attribute"><span class="html-tree-node__att-key"> {{key}}</span>="<span class="html-tree-node__att-val">{{value}}</span>"</span><!--
      -->&gt;
    </span>
    <span v-if="node.type == 'text'" class="html-tree-node__text">
      "{{node.content}}"
    </span>
    <span v-if="node.type == 'comment'" class="html-tree-node__comment">
      &lt;!--{{node.content}}--&gt;
    </span>
    <span v-if="node.type == 'doctype'" class="html-tree-node__doctype">
      &lt;!DOCTYPE<!--
      --><span v-for="(value, key) in node.params" class="html-tree-node__param"> {{value}}</span><!--
      -->&gt;
    </span>
    <div v-if="open && node.children && node.children.length" class="html-tree-node__children">
      <div v-for="child in node.children">
        <html-tree-node :node="child" :depth="depth + 1"></html-tree-node>
      </div>
    </div>
  </div>
</template>

<script>
    import HeroIcon from "../HeroIcon";
    export default {
      name: 'html-tree-node',
      components: {HeroIcon},
      props: ['node', 'depth'],
      created: function () {
        if (this.depth <= 1) {
          this.open = true
        }
      },
      data: function () {
        return {
          open: false
        }
      }
    }
</script>

<style scoped>
  .html-tree-node {
    font-family: monospace;
    font-size: 12px;
  }

  .html-tree-node__opener {
    display: inline-block;
    width: 20px;
    text-align: center;
  }

  .html-tree-node__children {
    padding-left: 20px;
  }

  .html-tree-node__doctype {
    color: #555;
    font-weight: bold;
  }

  .html-tree-node__text {
    color: #888;
  }

  .html-tree-node__element {
    color: #555;
    font-weight: bold;
  }

  .html-tree-node__comment {
    color: green;
  }

  .html-tree-node__tag {
    font-weight: bold;
    color: #520029;
  }

  .html-tree-node__attribute {
    font-weight: bold;
  }

  .html-tree-node__att-key {
    color: brown;
  }

  .html-tree-node__att-val {
    color: blue;
  }

  .html-tree-node__open,
  .html-tree-node__close {
    cursor: pointer;
    display: inline-block;
    width: 20px;
  }

</style>

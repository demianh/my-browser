<template>
  <div class="css-rule-declarations">
    <div v-for="decl in declarations">
      <span class="css-rule-declarations__key">{{decl.name}}</span>:
      <span class="css-rule-declarations__value" v-for="(keyword, index) in decl.value"><!--
        --><span v-if="index > 0">&nbsp;</span><!--
        --><span v-if="keyword.type == 'unit'" class="css-rule-declarations__unit">{{keyword.value}}<i>{{keyword.unit}}</i></span><!--
        --><span v-if="keyword.type == 'keyword'" class="css-rule-declarations__keyword">{{keyword.value}}</span><!--
        --><span v-if="keyword.type == 'function'" class="css-rule-declarations__function">{{keyword.value}}({{keyword.arguments}})</span><!--
      --></span>;
    </div>
  </div>
</template>

<script>
    export default {
      name: 'css-rule-declarations',
      props: ['declarations'],
      data: function () {
        return {
          open: false
        }
      }
    }
</script>

<style scoped>
  .css-rule-declarations {
    font-family: monospace;
    font-size: 12px;
  }

  .css-rule-declarations__key {
    color: #0b97c4;
  }
  .css-rule-declarations__value {

  }

  .css-rule-declarations__unit {
    color: #00d6b2;
  }

  .css-rule-declarations__function {
    color: #63002d;
  }

</style>

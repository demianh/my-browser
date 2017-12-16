<template>
  <div class="browser-content">
    &nbsp;
  </div>
</template>

<script>
  export default {
    name: 'browser-content',
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style scoped>
</style>

<template>
  <div class="app-container">
    <hanson></hanson>
  </div>
</template>

<script>
  import hanson from '@/components/SCTable'
  export default {
    name: 'demo',
    components: {
      hanson
    },
    data() {
      return {
        msg: [['sample', 'data'], ['aaa', 'zzz']]
      }
    }

  }
</script>

<style scoped>

</style>

<template>
  <div>
    <div>id {{ $route.params.slug }}</div>
  </div>
</template>

<script>
export default {
  setup() {
    return {}
  },
  mounted() {
    console.log(this.$route.params)
  },
}
</script>

<style lang="scss" scoped></style>

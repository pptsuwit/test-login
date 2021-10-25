<template>
  <section class="section">
    <layout-Navbar></layout-Navbar>
    <div class="container is-centered">
      <div class="is-centered">
        <h1 class="title has-text-justified">Welcome to Nuxt Auth</h1>
      </div>
      <nuxt-link to="/private">Go to app</nuxt-link>
    </div>
  </section>
</template>
<script>
export default {
  middleware: 'auth',
}
</script>

<template>
  <nav class="navbar is-light">
    <div class="container">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item" to="/">Nuxt Auth</nuxt-link>
      </div>
      <div class="navbar-brand" @click="toggleMenu = !toggleMenu">
        <button class="button navbar-burger">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="navbar-menu" :class="{ 'is-active': toggleMenu }">
          <div class="navbar-end">
            <div class="navbar-item has-dropdown is-hoverable">
              <div class="navbar-dropdown">
                <!-- <nuxt-link class="navbar-item" to="/profile"
                  >My Profile</nuxt-link
                > -->
                <hr class="navbar-divider" />
                <nuxt-link class="navbar-item" to="/add">Register</nuxt-link>
                <a class="navbar-item" @click="logout">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="navbar-menu">
        <div class="navbar-end">
          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link"> My Account </a>
            <div class="navbar-dropdown">
              <!-- <nuxt-link class="navbar-item" to="/profile"
                >My Profile</nuxt-link
              > -->
              <hr class="navbar-divider" />
              <a class="navbar-item" @click="logout">Logout</a>
            </div>
          </div>
          <template>
            <nuxt-link class="navbar-item" to="/add">Register</nuxt-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  name: 'Navbar',
  props: ['message'],
  data() {
    return { toggleMenu: false }
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$router.push('/login')
    },
  },
}
</script>

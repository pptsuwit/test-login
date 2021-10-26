<template>
  <div class="modal" v-bind:class="{ 'is-active': showDeleteModal }">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Do you want to remove this user?</p>
        <button
          class="delete"
          aria-label="close"
          @click="showModal = false"
        ></button>
      </header>
      <footer
        class="modal-card-foot is-pulled-right"
        style="justify-content: flex-end"
      >
        <button class="button is-success" @click="removeUser(deleteUserId)">
          Save changes
        </button>
        <button class="button" @click="$parent.showDeleteModal = false">
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: ['deleteUserId', 'showDeleteModal'],
  data() {
    return {}
  },
  methods: {
    async removeUser(id) {
      console.log(id)
      try {
        await this.$axios.delete('user/' + id).then((response) => {
          if (response.status === 200) {
            this.$parent.getAllUsers()
            this.$parent.showDeleteModal = false

            this.$toast('User was removed !')
          }
        })
      } catch (e) {
        console.log(e)
        this.error = e
      }
    },
  },
}
</script>

<style></style>

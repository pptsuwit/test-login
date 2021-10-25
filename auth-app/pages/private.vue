<template>
  <section class="section">
    <layout-Navbar></layout-Navbar>
    <div class="container">
      <div class="columns">
        <div class="column is-8 is-offset-2">
          <h2 class="title has-text-centered">CRUD - UserList</h2>
          <button class="button is-primary" @click="$router.push('add')">
            Add
          </button>
          <table class="table">
            <thead>
              <tr>
                <th class="has-text-centered">รูปประจำตัว</th>
                <th class="has-text-centered">ชื่อ - นามสกุล</th>
                <th class="has-text-centered">อีเมล์</th>
                <th class="has-text-centered">เบอร์โทรศัพท์</th>
                <th class="has-text-centered">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td class="has-text-centered">
                  <figure class="image is-48x48">
                    <img
                      class="is-rounded"
                      v-if="user.avatar"
                      :src="`http://localhost:5000/api/image/${user.avatar}`"
                    />
                    <img
                      v-else
                      class="is-rounded"
                      src="https://cdn0.iconfinder.com/data/icons/black-cat-emoticon-filled/64/cute_cat_kitten_face_per_avatar-02-512.png"
                    />
                  </figure>
                </td>
                <td class="has-text-centered">{{ user.fullname }}</td>
                <td class="has-text-centered">{{ user.email }}</td>
                <td class="has-text-centered">{{ user.telephone }}</td>
                <td class="has-text-centered">
                  <!-- <button class="button is-link my-1" @click="showEdit(user)"> -->
                  <button class="button is-link my-1" @click="showEdit(user)">
                    Edit
                  </button>
                  <button
                    class="button is-danger my-1"
                    @click="showDelete(user._id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- modal edit -->
    <Modal-Edit
      :user="editUser"
      :showModal="showModal"
      v-if="showModal"
    ></Modal-Edit>
    <Modal-Delete
      :deleteUserId="deleteUserId"
      :showDeleteModal="showDeleteModal"
      v-if="showDeleteModal"
    ></Modal-Delete>
  </section>
</template>
<script>
export default {
  data() {
    return {
      users: null,
      showModal: false,
      showDeleteModal: false,
      editUser: null,
      deleteUserId: null,
      error: null,
    }
  },
  methods: {
    showEdit(user) {
      this.showModal = true
      this.editUser = {
        fullname: user.fullname,
        email: user.email,
        telephone: user.telephone,
        userId: user._id,
        avatar: user.avatar,
      }
    },
    showDelete(id) {
      this.showDeleteModal = true
      this.deleteUserId = id
    },
    getAvatar(avatar) {
      console.log(avatar)
      try {
        this.$axios.get('/image/' + avatar).then((response) => {
          console.log(response)
          return response.data
        })
      } catch (e) {
        this.error = e.response.data.message
      }
    },
    async getAllUsers() {
      await this.$axios.get('users').then((response) => {
        this.users = response.data
      })
    },
  },
  mounted() {
    this.$axios.get('users').then((response) => {
      this.users = response.data
    })
  },
  middleware: 'auth',
}
</script>

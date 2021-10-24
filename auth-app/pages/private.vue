<template>
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-8 is-offset-2">
          <h2 class="title has-text-centered">UserList</h2>

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
                      v-if="user.avatar"
                      :src="`http://localhost:5000/api/image/${user.avatar}`"
                    />
                    <img
                      v-else
                      src="https://cdn0.iconfinder.com/data/icons/black-cat-emoticon-filled/64/cute_cat_kitten_face_per_avatar-02-512.png"
                    />
                  </figure>
                </td>
                <td class="has-text-centered">{{ user.fullname }}</td>
                <td class="has-text-centered">{{ user.email }}</td>
                <td class="has-text-centered">{{ user.telephone }}</td>
                <td class="has-text-centered">
                  <button class="button is-link" @click="showEdit(user)">
                    Edit
                  </button>
                  <button
                    class="button is-danger"
                    @click="removeUser(user._id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <button
            class="button is-fullwidth is-danger is-outlined"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
    <div class="modal" v-bind:class="{ 'is-active': showModal }">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Edit</p>
          <button
            class="delete"
            aria-label="close"
            @click="showModal = false"
          ></button>
        </header>
        <section class="modal-card-body">
          <!-- Content ... -->
          <section class="section">
            <div class="container">
              <div class="columns">
                <div class="column is-12">
                  <form method="post" @submit.prevent="edit">
                    <div class="field">
                      <label class="label">ชื่อ - นามสกุล</label>
                      <div class="control">
                        <input
                          type="text"
                          class="input"
                          name="fullname"
                          v-model="fullname"
                          required
                        />
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">อีเมล์</label>
                      <div class="control">
                        <input
                          type="email"
                          class="input"
                          name="email"
                          v-model="email"
                          required
                        />
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">เบอร์โทรศัพท์</label>
                      <div class="control">
                        <input
                          type="text"
                          class="input"
                          name="telephone"
                          v-model="telephone"
                          required
                        />
                      </div>
                    </div>
                    <div class="field">
                      <label class="label">รูปประจำตัว</label>
                      <div class="control">
                        <div class="file has-name is-fullwidth">
                          <input
                            type="file"
                            accept=".jpeg,.jpg,.png,image/jpeg,image/png"
                            aria-label="upload image button"
                            @change="selectFile"
                            name="file"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" @click="update(userId)">
            Save changes
          </button>
          <button class="button" @click="showModal = false">Cancel</button>
        </footer>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      users: null,
      showModal: false,
      fullname: '',
      email: '',
      password: '',
      error: null,
      telephone: '',
      file: '',
      editId: null,
      userId: '',
    }
  },
  methods: {
    selectFile(e) {
      this.file = e.target.files[0]
    },
    async logout() {
      await this.$auth.logout()
      this.$router.push('/')
    },
    showEdit(user) {
      this.showModal = true
      this.fullname = user.fullname
      this.email = user.email
      this.telephone = user.telephone
      this.userId = user._id
    },
    async update(id) {
      try {
        let formData = new FormData()
        formData.append('file', this.file)
        formData.append('fullname', this.fullname)
        formData.append('email', this.email)
        formData.append('telephone', this.telephone)
        formData.append('id', id)
        await this.$axios.put('update/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        await this.$axios.get('users').then((response) => {
          this.users = response.data
          if (response.status === 200) {
            alert('Update done!')
          }
        })
        this.showModal = false
      } catch (e) {
        this.showModal = false
        this.error = e.response.data.message
      }
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
    async removeUser(id) {
      try {
        await this.$axios.delete(id).then((response) => {
          if (response.status === 200) {
            alert('Delete !')
          }
        })

        await this.$axios.get('users').then((response) => {
          this.users = response.data
        })
      } catch (e) {
        this.error = e.response.data.message
      }
    },
  },
  mounted() {
    this.$axios.get('users').then((response) => {
      this.users = response.data
    })
  },
}
</script>

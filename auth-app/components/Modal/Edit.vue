<template>
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
                    <label class="label">รูปประจำตัว</label>
                    <div class="control">
                      <figure class="image is-128x128">
                        <p class="image is-128x128 is-square" v-if="fileFlag">
                          <img
                            class="is-square"
                            style="object-fit: fill"
                            :src="previewUrl"
                          />
                        </p>
                        <img
                          class="is-rounded"
                          v-else-if="user.avatar"
                          :src="`http://localhost:5000/api/image/${user.avatar}`"
                        />

                        <img
                          v-else
                          class="is-rounded"
                          src="https://cdn0.iconfinder.com/data/icons/black-cat-emoticon-filled/64/cute_cat_kitten_face_per_avatar-02-512.png"
                        />
                      </figure>
                    </div>
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
                  <div class="field">
                    <label class="label">ชื่อ - นามสกุล</label>
                    <div class="control">
                      <input
                        type="text"
                        class="input"
                        name="fullname"
                        v-model="user.fullname"
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
                        v-model="user.email"
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
                        v-model="user.telephone"
                        required
                      />
                    </div>
                  </div>
                  <!-- <div class="field">
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
                  </div> -->
                </form>
              </div>
            </div>
          </div>
        </section>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="update(user.userId)">
          Save changes
        </button>
        <button class="button" @click="$parent.showModal = false">
          Cancel
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: ['user', 'showModal'],
  data() {
    return {
      user: this.user,
      error: null,
      file: false,
      previewUrl: null,
      fileFlag: false,
    }
  },
  methods: {
    selectFile(event) {
      this.fileFlag = true
      const file = event.target.files[0]
      this.previewUrl = URL.createObjectURL(file)
      this.user.file = file
    },
    async update(id) {
      try {
        let formData = new FormData()
        formData.append('file', this.user.file)
        if (this.user.avatar) formData.append('avatar', this.user.avatar)
        formData.append('fullname', this.user.fullname)
        formData.append('email', this.user.email)
        formData.append('telephone', this.user.telephone)
        formData.append('id', id)
        await this.$axios
          .put('user/update/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then((response) => {
            if (response.status === 200) {
              this.$toast.success('User was updated !')

              this.$parent.getAllUsers()
              this.$parent.showModal = false
            }
          })
      } catch (e) {
        this.$parent.showModal = false
        this.error = e.response.data.message
      }
    },
  },
}
</script>

<style></style>

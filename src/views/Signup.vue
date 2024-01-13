<script>
import ReaderForm from "@/components/ReaderForm.vue"
import readerService from "@/services/reader.service"
export default {
  components: {
    ReaderForm,
  },
  data() {
    return {}
  },
  methods: {
    async createReader(data) {
      data.Password = data.NewPassword
      try {
        let result = await readerService.create(data)
        if (result.status == true) {
          alert("Tạo tài khoản thành công!")
          this.$router.push("login")
        } else alert(result.message)
      } catch (error) {
        alert(error.response?.data?.message || error.message)
      }
    },
  },
}
</script>

<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-lg-6 offset-lg-3">
        <ReaderForm
          mode="create"
          objectName="Tài khoản"
          @submit:object="createReader"
        />
      </div>
    </div>
  </div>
</template>

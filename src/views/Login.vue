<script>
import { Form, Field, ErrorMessage } from "vee-validate"
import * as yup from "yup"

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  data() {
    const objectFormSchema = yup.object().shape({
      username: yup
        .string()
        .required(`Tên đăng nhập không được rỗng`)
        .min(3, `Tên đăng nhập phải ít nhất 3 ký tự.`),
      password: yup
        .string()
        .required(`Mật khẩu không được rỗng`)
        .min(8, `Mật khẩu phải ít nhất 8 ký tự.`),
    })

    return {
      objectFormSchema,
      username: "",
      password: "",
    }
  },
  methods: {
    login() {
      this.$store.dispatch("login", {
        username: this.username,
        password: this.password,
      })
    },
  },
  created() {
    this.$store.dispatch("login", null)
  },
}
</script>

<template>
  <div class="container">
    <Form
      @submit="login"
      :validation-schema="objectFormSchema"
      class="p-5 shadow rounded-3 mx-auto"
      style="margin-top: 10rem; max-width: 800px"
    >
      <h2 class="text-center">Đăng nhập</h2>

      <div class="form-group mt-3">
        <label for="username">Tên đăng nhập</label>
        <Field
          name="username"
          type="text"
          class="form-control mt-1"
          v-model="username"
        />
        <ErrorMessage
          name="username"
          class="mt-2 d-block text-danger error-feedback"
        />
      </div>
      <div class="form-group mt-3">
        <label for="password">Mật khẩu</label>
        <Field
          name="password"
          type="password"
          class="form-control mt-1"
          v-model="password"
        />
        <ErrorMessage
          name="password"
          class="mt-2 d-block text-danger error-feedback"
        />
      </div>
      <div class="form-group mt-4 d-flex gap-4">
        <button class="btn btn-primary">Đăng nhập</button>
      </div>
      <p class="mt-4">
        Chưa có tài khoản?
        <router-link to="/Signup" class="text-decoration-underline text-primary"
          >Đăng ký</router-link
        >
      </p>
      <p class="mt-4">
        Quên mật khẩu?
        <a
          href="mailto:ducb2205863@student.ctu.edu.vn"
          class="text-decoration-underline text-primary"
          >Liên hệ thư viện</a
        >
      </p>
    </Form>
  </div>
</template>

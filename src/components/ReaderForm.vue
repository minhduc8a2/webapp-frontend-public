<script>
import * as yup from "yup"
/// configure here
const fieldList = [
  { fullName: "Họ lót", field: "HoLot", type: "text", min: 1 },
  { fullName: "Tên", field: "Ten", type: "text", min: 1 },
  { fullName: "Ngày sinh", field: "NgaySinh", type: "myDate", min: 1 },
  { fullName: "Giới tính", field: "Phai", type: "text", min: 1 },
  { fullName: "Địa chỉ", field: "DiaChi", type: "text", min: 1 },
  { fullName: "Số điện thoại", field: "DienThoai", type: "text", min: 10 },
  {
    fullName: "Mật khẩu hiện tại",
    field: "CurrentPassword",
    type: "password",
    min: 8,
  },
  { fullName: "Mật khẩu Mới", field: "NewPassword", type: "password", min: 8 },
  {
    fullName: "Xác nhận mật khẩu",
    field: "ConfirmPassword",
    type: "password",
    min: 8,
    relate: "NewPassword",
  },
]

////
function createYupObject(mode) {
  let result = {}
  if (mode == "create") {
    fieldList.splice(6, 1)
  }
  fieldList.forEach((field) => {
    if (field.type == "text") {
      result[field.field] = yup
        .string()
        .required(`${field.fullName} không được bỏ trống.`)
        .min(field.min, `${field.fullName} phải ít nhất ${field.min} ký tự.`)
      // .max(field.max, `${field.fullName} có nhiều nhất ${field.max} ký tự.`)
    } else if (field.type == "number") {
      result[field.field] = yup
        .number()
        .required(`${field.fullName} không được bỏ trống.`)
        .min(field.min, `${field.fullName} phải lớn hơn ${field.min}.`)
        // .max(field.max, `${field.field} phải ít hơn ${field.max}.`)
        .integer("Phải là số nguyên")
    } else if (field.type == "myDate") {
      result[field.field] = yup
        .string()
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Ngày không hợp lệ")
    } else if (field.field == "CurrentPassword") {
      result[field.field] = yup
        .string()
        .required(`${field.fullName} không được bỏ trống.`)
        .min(field.min, `${field.fullName} phải ít nhất ${field.min} ký tự.`)
    } else if (field.field == "NewPassword") {
      result[field.field] = yup.string()
    } else if (field.field == "ConfirmPassword") {
      result[field.field] = yup
        .string()
        .test("passwords-match", "Passwords must match", function (value) {
          return this.parent[field.relate] === value
        })
    }
  })
  return result
}
function createEmptyObject() {
  let result = {}
  fieldList.forEach((field) => {
    if (field.type == "text") result[field.field] = ""
    else if (field.type == "number") result[field.field] = 0
    else if (field.type == "myDate") {
      let currentDate = new Date()
      let day = currentDate.getDate().toString().padStart(2, "0")
      let month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
      let year = currentDate.getFullYear()

      result[field.field] = day + "/" + month + "/" + year
    }
  })
  return result
}
import { Form, Field, ErrorMessage } from "vee-validate"

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:object"],
  props: {
    currentObject: { type: Object },
    mode: { type: String, required: true },
    objectName: { type: String },
    mainField: { type: String },
  },
  data() {
    if (this.mode == "create") {
      fieldList.splice(6, 1)

      fieldList.unshift({
        fullName: "Tên đăng nhập",
        field: "MaDocGia",
        type: "text",
        min: 3,
      })
    }
    const objectFormSchema = yup.object().shape(createYupObject())
    return {
      objectLocal:
        this.mode == "edit"
          ? Object.create(this.currentObject)
          : createEmptyObject(),
      objectFormSchema,
      fieldList: fieldList,
    }
  },
  methods: {
    submitObject() {
      if (this.mode == "edit") this.$emit("submit:object", this.objectLocal)
      else this.$emit("submit:object", this.objectLocal)
    },
  },
  created() {
    this.objectLocal.CurrentPassword = ""
    this.objectLocal.NewPassword = ""
    this.objectLocal.ConfirmPassword = ""
  },
  updated() {
    if (this.mode == "edit")
      this.objectLocal = Object.create(this.currentObject)
  },
}
</script>
<template>
  <Form
    @submit="submitObject"
    :validation-schema="objectFormSchema"
    class="p-5 shadow rounded-3"
  >
    <h2 v-if="mode == 'edit'" class="text-center">
      {{ objectLocal[mainField] }}
    </h2>
    <h2 v-else class="text-center">
      Thêm <span class="text-lowercase">{{ objectName }}</span> mới
    </h2>
    <div class="form-group mt-3" v-for="(field, index) in fieldList">
      <label :for="field.field">{{ field.fullName }}</label>
      <Field
        :name="field.field"
        :type="field.type"
        class="form-control mt-1"
        v-model="objectLocal[field.field]"
      />
      <ErrorMessage :name="field.field" class="error-feedback" />
    </div>

    <div class="form-group mt-4 d-flex gap-4">
      <button class="btn btn-danger">
        <span v-if="mode == 'edit'">Cập nhật</span> <span v-else>Thêm</span>
      </button>
    </div>
  </Form>
</template>

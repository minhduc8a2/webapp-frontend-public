<script>
import * as yup from "yup"
/// configure here

const fieldList = [
  {
    fullName: "Mã đọc giả",
    field: "MaDocGia",
    type: "text",
    min: 1,
    readonly: true,
  },
  {
    fullName: "Mã sách",
    field: "MaSach",
    type: "text",
    min: 1,
    readonly: true,
  },
  {
    fullName: "Ngày mượn",
    field: "NgayMuon",
    type: "myDate",
    min: 1,
    readonly: false,
  },
  {
    fullName: "Ngày trả",
    field: "NgayTra",
    type: "myDate",
    min: 1,
    readonly: false,
  },
  {
    fullName: "Trạng thái",
    field: "TrangThai",
    type: "enum",
    min: 1,
    readonly: false,
    regex: "Cancelled|Pending|Accepted|Borrowed|Returned",
  },
]

////
function createYupObject() {
  let result = {}
  fieldList.forEach((field) => {
    if (field.type == "text" || field.type == "password") {
      result[field.field] = yup
        .string()
        .required(`${field.fullName} phải có giá trị.`)
        .min(field.min, `${field.fullName} phải ít nhất ${field.min} ký tự.`)
      // .max(field.max, `${field.fullName} có nhiều nhất ${field.max} ký tự.`)
    } else if (field.type == "number") {
      result[field.field] = yup
        .number()
        .required(`${field.fullName} phải có giá trị.`)
        .min(field.min, `${field.fullName} phải lớn hơn ${field.min}.`)
        // .max(field.max, `${field.field} phải ít hơn ${field.max}.`)
        .integer("Phải là số nguyên")
    } else if (field.type == "myDate") {
      result[field.field] = yup
        .string()
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Ngày không hợp lệ")
    } else if (field.type == "enum") {
      result[field.field] = yup
        .string()
        .matches(
          `^(${field.regex})$`,
          "Phải thuộc 1 trong các giá trị " + field.regex.split("|").join(", ")
        )
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
  emits: ["submit:object", "delete:object"],
  props: {
    currentObject: { type: Object },
    mode: { type: String, required: true },
    objectName: { type: String, required: true },
    mainField: { type: String, required: true },
  },
  data() {
    const objectFormSchema = yup.object().shape(createYupObject())
    return {
      objectLocal: this.currentObject || createEmptyObject(),
      objectFormSchema,
      fieldList: fieldList,
    }
  },
  methods: {
    submitObject() {
      if (this.mode == "edit")
        this.$emit("submit:object", this.objectLocal._id, this.objectLocal)
      else this.$emit("submit:object", this.objectLocal)
    },
    deleteObject() {
      this.$emit("delete:object", this.objectLocal._id)
    },
  },
  updated() {
    this.objectLocal = this.currentObject
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

    <div
      class="form-group mt-3"
      v-for="(field, index) in fieldList"
      :class="{ 'pe-none opacity-75': field.readonly && mode == 'edit' }"
    >
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
      <button class="btn btn-primary">Lưu</button>
      <button
        v-if="objectLocal._id"
        type="button"
        class="ml-2 btn btn-danger"
        @click="deleteObject"
      >
        Xóa
      </button>
    </div>
  </Form>
</template>

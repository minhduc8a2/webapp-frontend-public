<script>
//configure here
import readerService from "@/services/reader.service"
import ReaderForm from "@/components/ReaderForm.vue"
import other from "@/helper/other"

const service = readerService
const ThisForm = ReaderForm
////////////////////////////////////////////////////////////////////////

export default {
  components: {
    ThisForm,
  },
  data() {
    return {
      reader: null,
      edit: false,
      fieldList: [
        { fullName: "Tên đăng nhập", field: "MaDocGia", type: "text", min: 1 },
        { fullName: "Họ lót", field: "HoLot", type: "text", min: 1 },
        { fullName: "Tên", field: "Ten", type: "text", min: 1 },
        { fullName: "Ngày sinh", field: "NgaySinh", type: "myDate", min: 1 },
        { fullName: "Giới tính", field: "Phai", type: "text", min: 1 },
        { fullName: "Địa chỉ", field: "DiaChi", type: "text", min: 1 },
        {
          fullName: "Số điện thoại",
          field: "DienThoai",
          type: "text",
          min: 10,
        },
      ],
    }
  },

  methods: {
    //
    async updateReader(data) {
      try {
        let result = await service.update(this.reader.MaDocGia, data)
        console.log(result)
        if (result.status == true) {
          alert("Cập nhật thành công!")
          this.edit = false
          this.retrieveReader()
        } else alert(result.message)
      } catch (error) {
        alert(error.response?.data.message)
      }
    },

    async retrieveReader() {
      try {
        const res = await service.get(this.$store.state.logined.MaDocGia)
        if (res.status == true) {
          this.reader = res.data
          this.reader.NgaySinh = other.formatDate(this.reader.NgaySinh)
        }
      } catch (error) {
        alert(error.response?.data.message)
      }
    },
  },
  mounted() {
    this.retrieveReader()
  },
}
</script>
<template>
  <div class="container my-5" v-if="reader != null" style="font-size: 18px">
    <div class="row">
      <div class="col-6">
        <button class="btn border btn-light" @click="edit = !edit">
          <span v-if="!edit"> Cập nhật thông tin</span>
          <span v-else><i class="fa-solid fa-xmark"></i> Hủy</span>
        </button>

        <hr class="my-4" />
        <div class="p-4 shadow rounded-3">
          <p v-for="(field, index) in fieldList" class="my-2">
            {{ field.fullName }}:
            <span class="fw-semibold">{{ reader[field.field] }}</span>
          </p>
        </div>
      </div>
      <div class="col-6">
        <ThisForm
          mode="edit"
          v-if="edit"
          :currentObject="reader"
          mainField="Ten"
          objectName="Thông tin đọc giả"
          @submit:object="updateReader"
        />
      </div>
    </div>
  </div>
</template>

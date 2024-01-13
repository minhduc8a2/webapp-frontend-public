<script>
import publisherService from "@/services/publisher.service"

/// configure here

////

export default {
  props: {
    book: { type: Object },
    order: { type: Boolean },
  },
  emits: ["update:order"],

  data() {
    return {
      fieldList: [
        { fullName: "Mã Sách", field: "MaSach" },
        { fullName: "Tên Sách", field: "TenSach" },
        { fullName: "Số Quyển", field: "SoQuyen" },
        { fullName: "Nhà xuất bản", field: "TenNXB" },
        { fullName: "Năm xuất bản", field: "NamXuatBan" },
        { fullName: "Nguồn gốc/Tác giả", field: "NguonGoc/TacGia" },
      ],
    }
  },
  watch: {
    book() {
      this.getInfo()
    },
  },
  methods: {
    updateOrder() {
      this.$emit("update:order", true)
      console.log(true)
    },
    async getInfo() {
      console.log("getting nxb")

      try {
        let nxbResult = await publisherService.get(this.book.MaNXB)
        if (nxbResult.status == true) {
          this.book.TenNXB = nxbResult.data.TenNXB
        }
      } catch (error) {}
    },
  },
  mounted() {
    this.getInfo()
  },
}
</script>
<template>
  <div class="p-4 shadow rounded-4">
    <p
      v-for="(field, index) in fieldList"
      class="my-2"
      v-if="book.hasOwnProperty('TenNXB')"
    >
      {{ field.fullName }}:
      <span class="fw-semibold">{{ book[field.field] }}</span>
    </p>
    <button class="btn btn-outline-primary mt-4" @click="updateOrder">
      Mượn sách
    </button>
  </div>
</template>

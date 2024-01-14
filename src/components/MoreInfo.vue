<script>
import other from "@/helper/other"
export default {
  props: {
    borrowTracker: { type: Object, required: true },
  },
  data() {
    return {
      other: other,
      reader: this.$store.state.logined,
    }
  },
  emits: ["cancelBorrowTracker"],
  methods: {
    getStatus(status) {
      return other.bookStatus[status]
    },
    cancelBorrowTracker() {
      this.$emit("cancelBorrowTracker", this.borrowTracker._id)
    },
  },
 
}
</script>

<template>
  <div class="">
    <h2 class="text-center mb-4">Thông tin mượn sách</h2>
    <div class="p-4 rounded-2 shadow my-3">
      <p>
        Tên đọc giả:
        <span class="fw-bold"> {{ reader.HoLot + " " + reader.Ten }}</span>
      </p>
      <p>
        Số điện thoại: <span class="fw-bold"> {{ reader.DienThoai }}</span>
      </p>
    </div>
    <div class="p-4 rounded-2 shadow my-3">
      <p>
        Tên sách: <span class="fw-bold"> {{ borrowTracker.TenSach }}</span>
      </p>
      <p>
        Nguồn gốc/tác giả:
        <span class="fw-bold"> {{ borrowTracker["NguonGoc/TacGia"] }}</span>
      </p>
    </div>
    <div class="p-4 rounded-2 shadow my-3">
      <p>
        Ngày mượn:
        <span class="fw-bold">
          {{ other.formatDate(borrowTracker.NgayMuon) }}</span
        >
      </p>
      <p>
        Ngày trả:
        <span class="fw-bold">
          {{
            borrowTracker.NgayTra ? other.formatDate(borrowTracker.NgayTra) : ""
          }}</span
        >
      </p>
      <p>
        Trạng thái:
        <span class="fw-bold text-danger">
          {{ getStatus(borrowTracker.TrangThai) }}</span
        >
      </p>
      <hr />
      <div class="row justify-content-end">
        <button
          class="btn btn-danger me-2"
          style="width: fit-content"
          @click="cancelBorrowTracker"
          v-if="borrowTracker.TrangThai != 'Cancelled'"
        >
          Hủy mượn sách
        </button>
      </div>
    </div>
  </div>
</template>

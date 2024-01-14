<script>
import publisherService from "@/services/publisher.service"
import readerService from "@/services/reader.service"
import borrowTrackerService from "@/services/borrowTracker.service"
import other from "@/helper/other"
/// configure here

////

export default {
  props: {
    book: { type: Object },
  },
  data() {
    return {
      reader: null,
      other: other,
      borrowTracker: null,
      borrowInfo: {
        NgayMuon: other.formatDate(new Date().toString()),
      },
      borrowInfoFieldList: [{ fullName: "Ngày mượn", field: "NgayMuon" }],
      readerFieldList: [
        { fullName: "Họ Tên", field: "HoTen" },
        { fullName: "Địa chỉ", field: "DiaChi" },
        { fullName: "Số điện thoại", field: "DienThoai" },
      ],
      bookFieldList: [
        { fullName: "Mã Sách", field: "MaSach" },
        { fullName: "Tên Sách", field: "TenSach" },
        { fullName: "Số lượng", field: "SoLuong" },
        { fullName: "Nhà xuất bản", field: "TenNXB" },
        { fullName: "Năm xuất bản", field: "NamXuatBan" },
        { fullName: "Nguồn gốc/Tác giả", field: "NguonGoc/TacGia" },
      ],
    }
  },
  emits: ["update:order"],
  methods: {
    getStatusName(status) {
      return other.bookStatus[status]
    },
    updateOrder() {
      this.$emit("update:order", false)
    },
    async getInfo() {
      try {
        let nxbResult = await publisherService.get(this.book.MaNXB)
        let docGiaResult = await readerService.get(
          this.$store.state.logined.MaDocGia
        )
        let trackerResult = await borrowTrackerService.search(
          `MaSach=${this.book.MaSach}&&TrangThai=Pending`
        )
        if (trackerResult.data.length == 0) {
          trackerResult = await borrowTrackerService.search(
            `MaSach=${this.book.MaSach}&&TrangThai=Accepted`
          )
        }
        if (trackerResult.data.length == 0) {
          trackerResult = await borrowTrackerService.search(
            `MaSach=${this.book.MaSach}&&TrangThai=Borrowed`
          )
        }
        if (nxbResult.status == true && docGiaResult.status == true) {
          this.book.TenNXB = nxbResult.data.TenNXB
          this.reader = docGiaResult.data
          this.reader.HoTen = this.reader.HoLot + " " + this.reader.Ten
        }
        if (trackerResult.status == true && trackerResult.data.length > 0) {
          this.borrowTracker = trackerResult.data[0]
          console.log(trackerResult)
          this.borrowTracker.NgayMuon = other.formatDate(
            this.borrowTracker.NgayMuon
          )
          if (this.borrowTracker.NgayTra)
            this.borrowTracker.NgayTra = other.formatDate(
              this.borrowTracker.NgayTra
            )
          this.borrowInfo.NgayMuon = this.borrowTracker.NgayMuon
          this.borrowInfo.NgayTra = this.borrowTracker.NgayTra
        }
      } catch (error) {}
    },
    async makeOrder() {
      try {
        let result = await borrowTrackerService.create({
          MaDocGia: this.reader.MaDocGia,
          MaSach: this.book.MaSach,
          NgayMuon: new Date().toString(),
          NgayTra: this.borrowInfo.NgayTra,
          TrangThai: "Pending",
        })

        if (result.status == true) {
          alert(
            "Đã yêu cầu mượn sách thành công! Kiểm tra trạng thái mượn để đến thư viện lấy sách!"
          )
          this.updateOrder()
        }
      } catch (error) {
        alert("Đã yêu cầu mượn sách thất bại! Hãy thử lại sau!")
        this.updateOrder()
      }
    },
  },
  watch: {
    book() {
      this.getInfo()
    },
  },
  mounted() {
    if (!this.$store.state.logined) this.$router.push("login")
    this.getInfo()
    this.book.SoLuong = 1
  },
}
</script>
<template>
  <div class="p-4 shadow rounded-4" v-if="reader != null && book != null">
    <h2 class="text-center">Kiểm tra thông tin mượn sách</h2>
    <hr />
    <h4>Thông tin đọc giả</h4>
    <p v-for="(field, index) in readerFieldList" class="my-2">
      {{ field.fullName }}:
      <span class="fw-semibold">{{ reader[field.field] }}</span>
    </p>
    <hr />
    <h4>Thông tin Sách</h4>
    <p v-for="(field, index) in bookFieldList" class="my-2">
      {{ field.fullName }}:
      <span class="fw-semibold">{{ book[field.field] }}</span>
    </p>
    <hr />
    <p v-for="(field, index) in borrowInfoFieldList" class="my-2">
      {{ field.fullName }}:
      <span class="fw-semibold">{{ borrowInfo[field.field] }}</span>
    </p>
    <p class="my-2 text-danger" v-if="borrowTracker != null">
      Trạng thái:
      <span class="fw-semibold">{{
        getStatusName(borrowTracker.TrangThai)
      }}</span>
    </p>
    <p class="my-2 text-danger" v-if="borrowTracker != null">Đã yêu cầu mượn</p>
    <button
      class="btn btn-danger mt-4 me-4"
      @click="makeOrder"
      v-if="borrowTracker == null"
    >
      Xác nhận mượn sách
    </button>
    <button class="btn btn-light mt-4" @click="updateOrder">
      <span v-if="borrowTracker == null">Hủy</span>
      <span v-else>Đóng</span>
    </button>
  </div>
</template>

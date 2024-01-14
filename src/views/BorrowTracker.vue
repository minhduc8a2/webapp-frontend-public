<script>
//configure here
import borrowTrackerService from "@/services/borrowTracker.service"
import bookService from "@/services/book.service"
import BorrowTrackerForm from "@/components/BorrowTrackerForm.vue"
import other from "@/helper/other"
const fieldList = ["MaDocGia", "MaSach", "NgayMuon", "NgayTra", "TrangThai"]
const rawName = "borrowTracker"
const objectName = "Theo dõi mượn sách"
const mainField = "MaDocGia"
const service = borrowTrackerService
const ThisForm = BorrowTrackerForm
////////////////////////////////////////////////////////////////////////
import ObjectList from "@/components/ObjectList.vue"
import InputSearch from "@/components/InputSearch.vue"
import MoreInfo from "@/components/MoreInfo.vue"

export default {
  components: {
    ObjectList,
    ThisForm,
    InputSearch,
    MoreInfo,
  },
  data() {
    return {
      objectList: [],
      other: other,
      rawName,
      objectName,
      mainField,
      searchText: "",
      activeIndex: 1,
      create: false,
      filterType: "",
    }
  },

  computed: {
    objectStrings() {
      return this.objectList.map((item) => {
        let temp = ""
        let fields = Object.keys(item)
        for (const field of fields) {
          temp += item[field].toString().toLowerCase()
        }
        return temp
      })
    },

    filteredList() {
      if (!this.searchText) return this.objectList
      return this.objectList.filter((item, index) =>
        this.objectStrings[index].includes(this.searchText.toLowerCase())
      )
    },

    filteredListCount() {
      return this.filteredList.length
    },
  },
  watch: {
    searchText() {
      this.activeIndex = -1
    },
    filterType() {
      this.searchText = this.filterType
    },
  },
  methods: {
    async updateObject(id) {
      try {
        let result = await service.update(id, { TrangThai: "Cancelled" })

        if (result.status == true) {
          alert("Hủy thành công!")
        } else alert(result.message)
        this.refreshList()
      } catch (error) {
        alert(error.response?.data.message)
      }
    },
    async retrieveBook(id) {
      try {
        const res = await bookService.get(id)
        if (res.status == true) {
          return res.data
        } else {
          return {}
        }
      } catch (error) {
        alert(error.response?.data.message)
      }
    },
    async retrieveObjectList() {
      try {
        const res = await service.getAll()
        if (res.status == true) {
          this.objectList = res.data
          for (let index = 0; index < this.objectList.length; index++) {
            const element = this.objectList[index]
            let currentBook = await this.retrieveBook(element.MaSach)
            this.objectList[index].TenSach = currentBook.TenSach
            this.objectList[index]["NguonGoc/TacGia"] =
              currentBook["NguonGoc/TacGia"]
          }
        }
      } catch (error) {
        alert(error.response.data.message)
      }
    },
    refreshList() {
      this.retrieveObjectList()
      this.activeIndex = 0
    },
    async removeAllList() {
      if (confirm(`Bạn muốn xóa tất cả ${objectName}?`)) {
        try {
          await service.deleteAll()
          this.refreshList()
        } catch (error) {
          alert(error.response.data.message)
        }
      }
    },
    goToAddObject() {
      this.$router.push({ name: `${rawName}.add` })
    },
  },
  mounted() {
    this.refreshList()
  },
}
</script>
<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-6">
        <div class="">
          <InputSearch v-model="searchText" />
          <div class="row g-2 my-4">
            <div class="col-4">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  value=""
                  v-model="filterType"
                  checked
                />
                <label class="form-check-label" for="flexRadioDefault1">
                  Tất cả
                </label>
              </div>
            </div>
            <div
              class="col-4"
              v-for="(item, index) in Object.keys(other.bookStatus)"
            >
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  :id="index"
                  :value="item"
                  v-model="filterType"
                />
                <label class="form-check-label" :for="index">
                  {{ other.bookStatus[item] }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <hr class="my-4" />
        <ObjectList
          v-if="filteredListCount > 0 && !create"
          :objectList="filteredList"
          mainField="TenSach"
          :rawObjectName="rawName"
          v-model:activeIndex="activeIndex"
        />
        <h3 v-if="filteredListCount == 0">Chưa có sách nào được mượn!</h3>
      </div>
      <div class="col-6">
        <MoreInfo
          @cancelBorrowTracker="updateObject"
          :borrowTracker="filteredList[activeIndex]"
          v-if="filteredListCount > 0 && activeIndex >= 0"
        />
      </div>
    </div>
  </div>
</template>

<script>
//configure here
import BookService from "@/services/book.service"
import BookCard from "@/components/BookCard.vue"
import OrderCard from "@/components/OrderCard.vue"

const fieldList = [
  "MaSach",
  "TenSach",
  "DonGia",
  "SoQuyen",
  "DangYeuCau",
  "DangMuon",
  "NamXuatBan",
  "MaNXB",
  "NguonGoc/TacGia",
]
const rawName = "book"
const objectName = "Sách"
const mainField = "TenSach"
const service = BookService
const ThisCard = BookCard
////////////////////////////////////////////////////////////////////////
import ObjectList from "@/components/ObjectList.vue"
import InputSearch from "@/components/InputSearch.vue"

export default {
  components: {
    ObjectList,
    ThisCard,
    InputSearch,
    OrderCard,
  },
  data() {
    return {
      objectList: [],
      rawName,
      objectName,
      mainField,
      searchText: "",
      activeIndex: 1,
      order: false,
    }
  },

  computed: {
    objectStrings() {
      return this.objectList.map((item) => {
        let temp = ""
        for (const field of fieldList) {
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
    activeIndex() {
      if (this.order) this.order = false
    },
    searchText() {
      this.activeIndex = -1
    },
  },
  methods: {
    async retrieveObjectList() {
      try {
        const res = await service.getAll()
        this.objectList = res.data
      } catch (error) {
        alert(error.response.data.message)
      }
    },
    refreshList() {
      this.retrieveObjectList()
      this.activeIndex = 0
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
        <div
          class="d-flex justify-content-between align-items-center text-nowrap gap-4"
        >
          <InputSearch v-model="searchText" />
          <div
            class="bg-secondary opacity-50"
            style="width: 1px; height: 2rem"
          ></div>
        </div>

        <hr class="my-4" />
        <ObjectList
          v-if="filteredListCount > 0"
          :objectList="filteredList"
          :mainField="mainField"
          :rawObjectName="rawName"
          v-model:activeIndex="activeIndex"
        />
      </div>
      <div class="col-6">
        <ThisCard
          :book="filteredList[activeIndex]"
          v-if="filteredListCount > 0 && !order && activeIndex >= 0"
          v-model:order="order"
        />
        <OrderCard
          :book="filteredList[activeIndex]"
          v-model:order="order"
          v-if="filteredListCount > 0 && order && activeIndex >= 0"
        />
      </div>
    </div>
  </div>
</template>

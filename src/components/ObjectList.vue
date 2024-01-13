<script>
export default {
  props: {
    objectList: { type: Array, default: [] },
    mainField: { type: String, required: true },
    rawObjectName: { type: String, required: true },
    activeIndex: { type: Number, required: true },
  },
  emits: ["goToAdd", "update:activeIndex"],
  methods: {
    updateActiveIndex(index) {
      this.$emit("update:activeIndex", index)
      console.log(index)
    },
  },
  created() {
    console.log(this.objectList)
  },
}
</script>
<template>
  <ul class="list-group">
    <li
      class="list-group-item"
      :class="{ active: index === activeIndex }"
      v-for="(item, index) in objectList"
      :key="item._id"
      @click="updateActiveIndex(index)"
    >
      {{ item[mainField] }}
    </li>
  </ul>
</template>

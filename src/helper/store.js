import { createStore } from "vuex"
import readerService from "@/services/reader.service"
import router from "@/router/index"
const store = createStore({
  state() {
    return {
      logined: null,
    }
  },
  mutations: {
    setLogined(state, value) {
      state.logined = value
    },
  },
  getters: {
    logined(state) {
      return state.logined
    },
  },
  actions: {
    async login({ commit }, authData) {
      try {
        if (authData) {
          var result = await readerService.login({
            username: authData.username,
            password: authData.password,
          })
        } else {
          var result = await readerService.login({})
        }
        if (result.status == true) {
          localStorage.setItem("library_token", result.data.token)
          commit("setLogined", result.data.reader)
        }
        return result
      } catch (error) {
        console.log(error)
      }
    },
    async logout({ commit }) {
      console.log("logout")
      commit("setLogined", null)
      localStorage.removeItem("library_token")
      console.log(localStorage.getItem("library_token"))

      router.push({ name: "login" })
    },
  },
})
export default store

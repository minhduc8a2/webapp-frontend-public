import { createWebHistory, createRouter } from "vue-router"
import Book from "@/views/Book.vue"
import Reader from "@/views/Reader.vue"

import BorrowTracker from "@/views/BorrowTracker.vue"
import Login from "@/views/Login.vue"
import Signup from "@/views/Signup.vue"
import store from "@/helper/store"
const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
  },
  {
    path: "/",
    name: "home",
    component: Book,
    meta: { requiresAuth: true },
  },
  {
    path: "/books",
    name: "books",
    component: Book,
    meta: { requiresAuth: true },
  },
  // {
  //   path: "/books/:id",
  //   name: "book.edit",
  //   component: Book,
  // },
  {
    path: "/readers",
    name: "readers",
    component: Reader,
    meta: { requiresAuth: true },
  },

  {
    path: "/borrowTrackers",
    name: "borrowTrackers",
    component: BorrowTracker,
    meta: { requiresAuth: true },
  },

  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const logined = store.getters.logined
  // next-line: check if route ("to" object) needs authenticated

  if (
    to.name != "books" &&
    to.name != "home" &&
    to.name != "login" &&
    to.name != "signup" &&
    !logined
  )
    next({ name: "login" })
  else next()
})

export default router

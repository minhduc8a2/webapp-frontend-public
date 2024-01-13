import "@fortawesome/fontawesome-free/css/all.min.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import { createApp } from "vue"
import store from "@/helper/store"


// Create a new store instance.

import App from "./App.vue"

import router from "./router"
createApp(App).use(router).use(store).mount("#app")

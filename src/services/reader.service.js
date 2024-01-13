import createApiClient from "./api.service"
//configure here
class ReaderService {
  //configure here
  constructor(baseUrl = "/api/readers") {
    this.api = createApiClient(baseUrl)
  }
  setAuthorizationForHeaders() {
    const token = localStorage.getItem("library_token")
    if (token) {
      this.api.defaults.headers.common["Authorization"] = "Bearer " + token
    } else this.api.defaults.headers.common["Authorization"] = ""
  }

  async login(data) {
    this.setAuthorizationForHeaders()
    return (await this.api.post("/login", data)).data
  }

  async get(id) {
    this.setAuthorizationForHeaders()
    return (await this.api.get(`/fullInfo/${id}`)).data
  }
  async update(id, data) {
    this.setAuthorizationForHeaders()
    return (await this.api.put(`/${id}`, data)).data
  }
}
//configure here
export default new ReaderService()

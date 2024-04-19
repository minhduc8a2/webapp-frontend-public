import createApiClient from "./api.service"
//configure here
class BorrowTrackerService {
  //configure here
  constructor(baseUrl = "/api/borrowTrackers") {
    this.api = createApiClient(baseUrl)
  }
  setAuthorizationForHeaders() {
    const token = localStorage.getItem("library_token_public")
    if (token) {
      this.api.defaults.headers.common["Authorization"] = "Bearer " + token
    } else this.api.defaults.headers.common["Authorization"] = ""
  }
  async getAll() {
    this.setAuthorizationForHeaders()
    return (await this.api.get("/")).data
  }
  async search(query) {
    this.setAuthorizationForHeaders()
    return (await this.api.get("?" + query)).data
  }
  async create(data) {
    this.setAuthorizationForHeaders()
    return (await this.api.post("/", data)).data
  }
  async deleteAll() {
    this.setAuthorizationForHeaders()
    return (await this.api.delete("/")).data
  }
  async get(id) {
    this.setAuthorizationForHeaders()
    return (await this.api.get(`/${id}`)).data
  }
  async update(id, data) {
    this.setAuthorizationForHeaders()
    return (await this.api.put(`/${id}`, data)).data
  }
  async delete(id) {
    this.setAuthorizationForHeaders()
    return (await this.api.delete(`/${id}`)).data
  }
}
//configure here
export default new BorrowTrackerService()

const bookStatus = {
  Cancelled: "Đã hủy",
  Pending: "Đang xử lý",
  Rejected: "Từ chối",
  Accepted: "Chấp nhận",
  Borrowed: "Đã mượn",
  Returned: "Đã trả",
}
function formatDate(dateString, days = 0) {
  if (dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) return dateString
  let currentDate = new Date(dateString)
  currentDate.setDate(currentDate.getDate() + days)
  let day = currentDate.getDate().toString().padStart(2, "0")
  let month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
  let year = currentDate.getFullYear()

  return day + "/" + month + "/" + year
}

function createDate(inputDateString) {
  let temp = inputDateString.split("/")
  let day = temp[0]
  let monthIndex = temp[1] - 1
  let year = temp[2]
  return new Date(year, monthIndex, day).toString()
}
export default {
  bookStatus,
  formatDate,
  createDate,
}

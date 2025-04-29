export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Lấy ngày và thêm số 0 nếu ngày < 10
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Lấy tháng, nhớ cộng 1 vì tháng trong JavaScript bắt đầu từ 0
    const year = date.getFullYear(); // Lấy năm
    return `${day}/${month}/${year}`; // Định dạng lại thành dd/mm/yyyy
};
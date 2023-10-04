// Trong thư mục "services"
// Services là thành phần chứa logic kinh doanh chính của ứng dụng. Chúng chứa các hàm thực hiện các tác vụ như xử lý dữ liệu, thêm, sửa, xóa, hoặc truy vấn cơ sở dữ liệu.
// Services có thể gọi model để tương tác trực tiếp với cơ sở dữ liệu để lấy hoặc cập nhật thông tin.:
// Hàm xử lý logic nghiệp vụ cụ thể cho ứng dụng, ví dụ: đăng nhập, thanh toán, tạo tài khoản người dùng, v.v.
// Hàm tiện ích để thực hiện các tác vụ chung cho ứng dụng, ví dụ: mã hoá mật khẩu, gửi email, xử lý thanh toán, v.v.

const bcrypt = require("bcrypt");
const saltRounds = 8;

// Hàm mã hoá mật khẩu
const hashPassword = async (plainPassword) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
};

// Hàm so sánh mật khẩu đã băm với mật khẩu nguyên thủy
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  hashPassword,
  comparePassword,
};

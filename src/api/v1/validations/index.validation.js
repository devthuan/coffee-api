// Trong thư mục "validations":
// Hàm kiểm tra và xác thực dữ liệu đầu vào từ client trước khi xử lý bất kỳ tác vụ nào.
// Hàm kiểm tra tính hợp lệ của dữ liệu như định dạng email, số điện thoại, v.v.

const validateRegisterData = (password, phone_number) => {
  const errors = [];

  // Kiểm tra xem user_name có tồn tại và không trống
  // if (!user_name || user_name.trim() === "" || !isValidUsername(user_name)) {
  //   errors.push("Username is required.");
  // }

  // Kiểm tra xem password có tồn tại và không trống
  if (!password || password.trim() === "") {
    errors.push("Password is required.");
  }

  // Kiểm tra xem phone_number có tồn tại và là một số điện thoại hợp lệ
  if (!phone_number || !isValidPhoneNumber(phone_number)) {
    errors.push("Phone number is required and must be a valid phone number.");
  }

  // Nếu có lỗi, trả về mảng lỗi
  if (errors.length > 0) {
    return errors;
  }

  // Nếu không có lỗi, trả về null để cho biết không có lỗi
  return null;
};

// Hàm kiểm tra số điện thoại hợp lệ
const isValidPhoneNumber = (phone_number) => {
  // Điều kiện kiểm tra số điện thoại
  // Thay bằng điều kiện phù hợp với định dạng số điện thoại của bạn
  const phoneNumberRegex = /^\d{10}$/;

  return phoneNumberRegex.test(phone_number);
};

const isValidUsername = (username) => {
  let usernameRegex = /^[a-zA-Z0-9]+$/;
  return usernameRegex.test(username);
};

module.exports = {
  validateRegisterData,
};

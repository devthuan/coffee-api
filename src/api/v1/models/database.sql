-- Bảng Users
CREATE TABLE Users (
    id INT PRIMARY KEY  AUTO_INCREMENT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    is_staff VARCHAR(20),
    is_active INT(2),
    created_date DATETIME
);

-- Bảng Products
CREATE TABLE Products (
    id INT PRIMARY KEY  AUTO_INCREMENT,
    name_product VARCHAR(255) NOT NULL,
    image_product BLOB,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    is_active INT(2),
    created_date DATETIME
);

-- Tạo bảng Đơn hàng
CREATE TABLE Orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    cart_id int not null,
    full_name VARCHAR(100) not null,
    phone_number VARCHAR(10) not null,
    order_date DATETIME NOT NULL,
    order_status VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id), -- Nếu có bảng Users
    FOREIGN KEY (product_id) REFERENCES Products(id) -- Nếu có bảng Products
    FOREIGN KEY (cart_id) REFERENCES Cart(cart_id) -- Nếu có bảng Products
);




-- Tạo bảng Giỏ hàng
CREATE TABLE Cart (
    cart_id INT PRIMARY KEY  AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);

-- Tạo bảng Doanh số bán hàng
CREATE TABLE Sales (
    sale_id INT PRIMARY KEY  AUTO_INCREMENT,
    sale_date DATE,
    total_sales DECIMAL(10, 2)
);

-- Tạo bảng Nhân viên
CREATE TABLE Employees (
    employee_id INT PRIMARY KEY  AUTO_INCREMENT,
    employee_name VARCHAR(255) not null,
    employee_email VARCHAR(255),
    phone_number VARCHAR(10) not null,
    position VARCHAR(255),
    created_date DATETIME
);

-- tạo bảng tokens
CREATE TABLE Tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    refresh_token VARCHAR(255),
    created_date DATETIME,
    update_date DATETIME,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);




-- Thêm dữ liệu vào bảng Users
INSERT INTO Users (id, username, password, phone_number, is_staff, created_date)
VALUES
    (1, 'user1', 'password1', 1234567890, 'staff1', '2023-09-08'),
    (2, 'user2', 'password2', 9876543210, 'staff2', '2023-09-08'),
    (3, 'user3', 'password3', 5555555555, 'staff3', '2023-09-08'),
    (4, 'user4', 'password4', 1111111111, 'staff4', '2023-09-08'),
    (5, 'user5', 'password5', 9999999999, 'staff5', '2023-09-08');

-- Thêm dữ liệu vào bảng Products
INSERT INTO Orders (user_id, cart_id, full_name, phone_number, address, order_date, order_status)
VALUES
    (1, 1, 'Nguyễn Văn A', '1234567890', 'Địa chỉ A', '2023-09-11 10:00:00', 'Đang xử lý'),
    (2, 2, 'Trần Thị B', '0987654321', 'Địa chỉ B', '2023-09-11 11:30:00', 'Hoàn thành'),
    (3, 3, 'Lê Văn C', '0123456789', 'Địa chỉ C', '2023-09-11 12:45:00', 'Chờ giao hàng'),
    (1, 4, 'Phạm Thị D', '0987654321', 'Địa chỉ D', '2023-09-11 14:15:00', 'Đã giao hàng'),
    (4, 5, 'Trương Văn E', '1234567890', 'Địa chỉ E', '2023-09-11 15:30:00', 'Chờ xác nhận');

-- Thêm dữ liệu vào bảng Orders
-- Chèn hàng đầu tiên
INSERT INTO Orders (user_id, product_id, cart_id, full_name, phone_number, order_date, order_status)
VALUES (1, 1, 1, 'Nguyễn Văn A', '1234567890', NOW(), 'Đang xử lý');
        (2, 2, 2, 'Trần Thị B', '0987654321', NOW(), 'Hoàn thành'),
        (3, 3, 3, 'Lê Văn C', '0123456789', NOW(), 'Chờ giao hàng');


-- Thêm dữ liệu vào bảng Cart
INSERT INTO Cart (cart_id, user_id, product_id, quantity)
VALUES
    (1, 1, 2, 1),
    (2, 2, 4, 2),
    (3, 3, 1, 3),
    (4, 4, 5, 1),
    (5, 5, 3, 2);

-- Thêm dữ liệu vào bảng Sales
INSERT INTO Sales (sale_id, sale_date, total_sales)
VALUES
    (1, '2023-09-08', 50.0),
    (2, '2023-09-08', 75.0),
    (3, '2023-09-08', 30.0),
    (4, '2023-09-08', 40.0),
    (5, '2023-09-08', 65.0);

-- Thêm dữ liệu vào bảng Employees
INSERT INTO Employees (employee_id, employee_name, employee_email, phone_number, position)
VALUES
    (1, 'Employee1', 'employee1@example.com', '1234567890', 'Manager'),
    (2, 'Employee2', 'employee2@example.com', '9876543210', 'Sales Associate'),
    (3, 'Employee3', 'employee3@example.com', '5555555555', 'Customer Support'),
    (4, 'Employee4', 'employee4@example.com', '1111111111', 'Warehouse Manager'),
    (5, 'Employee5', 'employee5@example.com', '9999999999', 'Cashier');


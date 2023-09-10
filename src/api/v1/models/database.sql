-- Bảng Users
CREATE TABLE Users (
    id INT PRIMARY KEY  AUTO_INCREMENT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    is_staff VARCHAR(20),
    created_date DATETIME
);

-- Bảng Products
CREATE TABLE Products (
    id INT PRIMARY KEY  AUTO_INCREMENT,
    name_product VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    created_date DATETIME
);

-- Tạo bảng Đơn hàng
CREATE TABLE Orders (
    order_id INT PRIMARY KEY  AUTO_INCREMENT,
    user_id INT,
    order_date DATETIME,
    order_status VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Tạo bảng Chi tiết đơn hàng
CREATE TABLE OrderDetails (
    id INT PRIMARY KEY  AUTO_INCREMENT,
    order_id INT,
    product_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES Orders(order_id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
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
    position VARCHAR(255)
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
INSERT INTO Products (id, name_product, description, price, created_date)
VALUES
    (1, 'Product1', 'Description1', 10.99, '2023-09-08'),
    (2, 'Product2', 'Description2', 15.49, '2023-09-08'),
    (3, 'Product3', 'Description3', 5.99, '2023-09-08'),
    (4, 'Product4', 'Description4', 7.89, '2023-09-08'),
    (5, 'Product5', 'Description5', 12.99, '2023-09-08');

-- Thêm dữ liệu vào bảng Orders
INSERT INTO Orders (order_id, user_id, order_date, order_status)
VALUES
    (1, 1, '2023-09-08', 'Confirmed'),
    (2, 2, '2023-09-08', 'Processing'),
    (3, 3, '2023-09-08', 'Shipped'),
    (4, 4, '2023-09-08', 'Delivered'),
    (5, 5, '2023-09-08', 'Cancelled');

-- Thêm dữ liệu vào bảng OrderDetails
INSERT INTO OrderDetails (id, order_id, product_id, quantity, price)
VALUES
    (1, 1, 1, 2, 10.99),
    (2, 1, 3, 1, 5.99),
    (3, 2, 2, 3, 15.49),
    (4, 3, 4, 2, 7.89),
    (5, 4, 5, 1, 12.99);

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


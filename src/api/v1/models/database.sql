-- Bảng Users
CREATE TABLE Users (
    id INT PRIMARY KEY  AUTO_INCREMENT AUTO_INCREMENT,
    phone_number VARCHAR(10) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL ,
    is_staff VARCHAR(20),
    is_active INT(2),
    address varchar(255),
    created_date DATETIME
);

-- Bảng Products
CREATE TABLE Products (
    id INT PRIMARY KEY  AUTO_INCREMENT,
    name_product VARCHAR(255) NOT NULL,
    image_product BLOB,
    category VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    is_active INT(2),
    created_date DATETIME
);

-- Tạo bảng Đơn hàng
CREATE TABLE Orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    delivery_address VARCHAR(255) NOT NULL,
    order_date DATETIME NOT NULL,
    payment_methods VARCHAR(255) NOT NULL,
    order_status VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);


CREATE TABLE OrderDetail (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(id),
    FOREIGN KEY (product_id) REFERENCES Products(id)
);




-- Tạo bảng Giỏ hàng
CREATE TABLE Cart (
    cart_id INT PRIMARY KEY  AUTO_INCREMENT,
    user_id INT not null,
    product_id INT not null,
    quantity INT not null,
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
INSERT INTO Users (id, phone_number, password, full_name, is_staff,is_active, address, created_date)
VALUES (1,  "0945986661", '.' , 'Trần Phước Thuận', 'staff', 1, 'Tân Phú,HCM' , '2023-09-08')

-- Thêm dữ liệu vào bảng Products
INSERT INTO Products (name_product, image_product, category, price, is_active, created_date)
VALUES ('Cà phê sữa đen', NULL, 'cà phê', 25000, 1, '2023-10-05 08:30:00')



-- Thêm dữ liệu vào bảng Orders
INSERT INTO Orders (user_id, full_name, phone_number, delivery_address, order_date, payment_methods, order_status)
VALUES (1, 'John Doe', '1234567890', '123 Main St', '2023-10-07 14:30:00', 'Credit Card', 'Processing')
   

-- Thêm dữ liệu vào bảng OrderDetail
INSERT INTO OrderDetail (order_id, product_id, quantity)
VALUES (1, 1, 2)

INSERT INTO Cart (user_id, product_id, quantity) 
VALUES (1,1,2)

    
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


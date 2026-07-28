Use stepup;

CREATE TABLE Users(
	UserId VARCHAR(15) PRIMARY KEY,
    Name VARCHAR(20),
    Phone BIGINT UNIQUE,
    Email VARCHAR(50) UNIQUE
);

-- Trigger For User ID
DELIMITER //

CREATE TRIGGER trg_userid
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Users;

    SET NEW.UserId =
        CONCAT('User',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;


CREATE TABLE Address(
	AddrID VARCHAR(15) PRIMARY KEY,
	UserId VARCHAR(15) ,
    Home_no VARCHAR(10),
    Street VARCHAR(30),
    City VARCHAR(20),
    State VARCHAR(20),
    PinCode INT,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);


-- Trigger for User-Address ID 
DELIMITER //

CREATE TRIGGER trg_addrID
BEFORE INSERT ON Address
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Address;

    SET NEW.AddrId =
        CONCAT('Addr',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;

SELECT * FROM Address;

-- Seller Table

CREATE TABLE Seller(
	SellerID VARCHAR(15) PRIMARY KEY,
    Name VARCHAR(20),
    ShopName VARCHAR(50),
    ShopNo VARCHAR(10),
    Phone BIGINT UNIQUE,
    Email VARCHAR(50),
    Pswrd VARCHAR(50) NOT NULL
)

-- Trigger for seller iD
DELIMITER //
CREATE TRIGGER trg_sellerID
BEFORE INSERT ON Seller
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Seller;

    SET NEW.sellerId =
        CONCAT('slr',
               LPAD(nextNum, 3, '0'));
END//
DELIMITER ;



CREATE TABLE SellerAddress(
	SAddrID VARCHAR(15) PRIMARY KEY,
    SellerID VARCHAR(15),
    Street VARCHAR(20),
    City VARCHAR(20),
    State VARCHAR(20),
    PinCode INT,
    FOREIGN KEY (SellerID) REFERENCES Seller(SellerID)
)

--TRIGGER
DELIMITER //

CREATE TRIGGER trg_SAddrID
BEFORE INSERT ON SellerAddress
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM SellerAddress;

    SET NEW.SAddrId =
        CONCAT('saddr',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;



CREATE TABLE Category (
	Cat_ID VARCHAR(15) PRIMARY KEY,
    Cat_Name VARCHAR(20)
);

DELIMITER //

CREATE TRIGGER trg_cat_id
BEFORE INSERT ON Category
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Category;

    SET NEW.Cat_ID =
        CONCAT('Cat',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;

INSERT INTO Category (Cat_Name) 
Values ('Kids');

CREATE TABLE Brand (
	Brand_ID VARCHAR(15) PRIMARY KEY,
    Brand_name VARCHAR(20)
);
DELIMITER //

CREATE TRIGGER trg_brand_id
BEFORE INSERT ON Brand
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Brand;

    SET NEW.Brand_ID =
        CONCAT('brand',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;

INSERT INTO Brand (Brand_name) 
Values ('Puma');
SELECT * FROM Brand;



CREATE TABLE Product (
	Prod_ID VARCHAR(15) PRIMARY KEY,
    Cat_ID VARCHAR(15), FOREIGN KEY (Cat_ID) REFERENCES Category(Cat_ID),
	Brand_ID VARCHAR(30), FOREIGN KEY (Brand_ID) REFERENCES Brand(Brand_ID),
    SellerID VARCHAR(15), FOREIGN KEY (SellerID) REFERENCES Seller(SellerID),
    Prod_Name VARCHAR(30),
    Dscrptn VARCHAR(50)
);
DELIMITER //

CREATE TRIGGER trg_prod_id
BEFORE INSERT ON Product
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Product;

    SET NEW.Prod_ID =
        CONCAT('prod',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;

INSERT INTO Product (Cat_ID,Brand_ID,SellerID,Prod_Name,Dscrptn) 
Values ('cat001','brand001','slr001','Running Shoe','Soft and comfortable high quality Running shoe');
SELECT * FROM Product;


CREATE TABLE Color (
	Color_ID VARCHAR(15) PRIMARY KEY,
    Color_Name VARCHAR(15)
);
DELIMITER //

CREATE TRIGGER trg_color_id
BEFORE INSERT ON Color
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Color;

    SET NEW.Color_ID =
        CONCAT('color',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;
INSERT INTO Color (Color_Name) 
Values ('Black');
SELECT * FROM Color;

CREATE TABLE Size (
	Size_ID VARCHAR(15) PRIMARY KEY,
    Size_no INT
);
DELIMITER //

CREATE TRIGGER trg_size_id
BEFORE INSERT ON Size
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Size;

    SET NEW.Size_ID =
        CONCAT('size',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;
INSERT INTO Size (Size_no) 
Values (9);
SELECT * FROM Size;


CREATE TABLE Image (
	Image_ID VARCHAR(15) PRIMARY KEY,
    Prod_ID VARCHAR(15), FOREIGN KEY (Prod_ID) REFERENCES Product(Prod_ID),
    Img_url VARCHAR(100),
    alt_text VARCHAR(50)
);
DELIMITER //

CREATE TRIGGER trg_image_id
BEFORE INSERT ON Image
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Image;

    SET NEW.Image_ID =
        CONCAT('img',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;
INSERT INTO Image (Prod_ID,Img_url,alt_text) 
Values ('prod002','https://image2.com','shoeImage2');
SELECT * FROM Image;


CREATE TABLE Product_Variant (
	Variant_ID VARCHAR(15) PRIMARY KEY,
    Prod_ID VARCHAR(15), FOREIGN KEY (Prod_ID) REFERENCES Product(Prod_ID),
    color_ID VARCHAR(15), FOREIGN KEY (Color_ID) REFERENCES Color(Color_ID),
    Size_ID VARCHAR(15), FOREIGN KEY (Size_ID) REFERENCES Size(Size_ID),
    Price DECIMAL,
    StockQuantity INT,
    Image_ID VARCHAR(100), FOREIGN KEY (Image_ID) REFERENCES Image(Image_ID),
    SKU VARCHAR(15) UNIQUE
);

DELIMITER //

CREATE TRIGGER trg_variant_id
BEFORE INSERT ON Product_Variant
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Product_Variant;

    SET NEW.Variant_ID =
        CONCAT('var',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;

INSERT INTO Product_Variant (Prod_ID,Color_ID,Size_ID,Price, StockQuantity,Image_ID,SKU) 
Values ('prod001','color001','size001',2000.00,10,'img001','shoe_var_AAA001');
SELECT * FROM Product_Variant;



-- Table for Orders and Multiple Orders and Payments

CREATE TABLE Orders (
	Order_ID VARCHAR(15) PRIMARY KEY,
    UserID VARCHAR(15), FOREIGN KEY (UserID) REFERENCES Users(UserID),
    OrderDate DATETIME,
    TotalAmount DECIMAL,
    Order_Status VARCHAR(10)
);
DELIMITER //

CREATE TRIGGER trg_order_id
BEFORE INSERT ON Orders
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Orders;

    SET NEW.Order_ID =
        CONCAT('order',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;

INSERT INTO Orders(UserID,OrderDate, TotalAmount,Order_Status) 
Values('User001','2026-06-17',2000.00,'Pending');


SELECT * FROM Orders;

CREATE TABLE Order_Item (
	OrderItem_ID VARCHAR(15) PRIMARY KEY,
    Order_ID VARCHAR(15), FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID),
    Variant_ID VARCHAR(15), FOREIGN KEY (Variant_ID) REFERENCES Product_Variant(Variant_ID),
    Quantity INT,
    PriceAtPurchase DECIMAL
);
DELIMITER //

CREATE TRIGGER trg_ordItem_id
BEFORE INSERT ON Order_Item
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Order_Item;

    SET NEW.OrderItem_ID =
        CONCAT('ord_item',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;

INSERT INTO Order_Item(Order_ID,Variant_ID, Quantity,PriceAtPurchase) 
Values('order001','var001',4,'1500');


SELECT * FROM Order_Item;

CREATE TABLE Payment(
	Payment_ID VARCHAR(15) PRIMARY KEY,
    Order_ID VARCHAR(15), FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID),
    Amount DECIMAL,
    Payment_Method VARCHAR(10),
    Payment_Status VARCHAR(10),
    Payment_Date DATETIME
);
DELIMITER //

CREATE TRIGGER trg_payment_id
BEFORE INSERT ON Payment
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Payment;

    SET NEW.Payment_ID =
        CONCAT('payment',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;

INSERT INTO Payment(Order_ID,Amount,Payment_Method,Payment_Status,Payment_Date)
VALUES ('order001',2000,'UPI','Processing','2026-06-17');
SELECT * FROM Payment;

-- Table For Cart
CREATE TABLE Cart(
	Cart_ID VARCHAR(15) PRIMARY KEY,
    UserID VARCHAR(15), FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
DELIMITER //

CREATE TRIGGER trg_cart_id
BEFORE INSERT ON Cart
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Cart;

    SET NEW.Cart_ID =
        CONCAT('cart',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;

INSERT INTO Cart(UserID) 
VALUES ('User001');
SELECT * from Cart;

CREATE TABLE Cart_Item(
	CartItem_ID VARCHAR(15) PRIMARY KEY,
    Cart_ID VARCHAR(15), FOREIGN KEY (Cart_ID) REFERENCES Cart(Cart_ID),
    Variant_ID VARCHAR(15), FOREIGN KEY (Variant_ID) REFERENCES Product_Variant(Variant_ID),
    Quantity INT
);
DELIMITER //

CREATE TRIGGER trg_cart_item_id
BEFORE INSERT ON Cart_Item
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Cart_Item;

    SET NEW.CartItem_ID =
        CONCAT('cart_item',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;
INSERT INTO Cart_Item(Cart_ID,Variant_ID,Quantity) 
VALUES ('cart001','var001',2);
SELECT * from Cart_Item;

-- Tables for Wishlist

CREATE TABLE Wishlist(
	Wishlist_ID VARCHAR(15) PRIMARY KEY,
    UserID VARCHAR(15), FOREIGN KEY (UserID) REFERENCES Users(UserID),
    Prod_ID VARCHAR(15), FOREIGN KEY (Prod_ID) REFERENCES Product(Prod_ID),
    Added_Date DATETIME
);
DELIMITER //

CREATE TRIGGER trg_wishlist_id
BEFORE INSERT ON Wishlist
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Wishlist;

    SET NEW.Wishlist_ID =
        CONCAT('wishlist',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;
INSERT INTO Wishlist(UserID,Prod_ID,Added_Date) 
VALUES ('User001','prod001','2026-06-17');
SELECT * from Wishlist;

-- Table for Admin

CREATE TABLE Admin_table(
	Admin_ID VARCHAR(15) PRIMARY KEY,
    Name VARCHAR(20),
    Email VARCHAR(50),
    Password VARCHAR(50),
    Role VARCHAR(10),
    CreatedAt DATETIME,
    LastLogin DATETIME
);
DELIMITER //

CREATE TRIGGER trg_admin_id
BEFORE INSERT ON Admin_table
FOR EACH ROW
BEGIN
    DECLARE nextNum INT;

    SELECT COUNT(*) + 1
    INTO nextNum
    FROM Admin_table;

    SET NEW.Admin_ID =
        CONCAT('admin',
               LPAD(nextNum, 3, '0'));
END//

DELIMITER ;

INSERT INTO Admin_table(Name, Email,Password,Role, CreatedAt,LastLogin)
Values ('ADMIN','admin@admin.com', 'Password', 'SuperAdmin', '2026-05-05','2026-06-17');

Select *from Admin_table;
Select *from Users;
Select *from Address;
Select *from Seller;
Select *from SellerAddress;
Select *from Category;
Select *from Brand;
Select *from Color;
Select *from Product;
Select *from Size;
Select *from Image;
Select *from Product_Variant;
Select *from Orders;
Select *from Order_Item;
Select *from Cart;
Select *from Cart_Item;
Select *from Payment;
Select *from Wishlist;

/* 
Add CreatedAt and UpdatedAT column to tables for sorting the products for new arrival page
and Seller Registration tracking, order history and analytics

-Users
-Seller
-Product
-Order
-Payment
*/


SHOW TABLES;
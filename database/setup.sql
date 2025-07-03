-- Tạo bảng users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tạo bảng contract_templates
CREATE TABLE contract_templates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    variables JSON,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tạo bảng persons
CREATE TABLE persons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    id_number VARCHAR(20) UNIQUE NOT NULL,
    id_issued_date DATE,
    id_issued_place VARCHAR(100),
    birth_date DATE,
    gender ENUM('male', 'female', 'other'),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    nationality VARCHAR(50) DEFAULT 'Việt Nam',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_id_number (id_number),
    INDEX idx_full_name (full_name),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tạo bảng properties
CREATE TABLE properties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    address TEXT,
    area DECIMAL(10,2),
    value DECIMAL(15,2),
    ownership_certificate VARCHAR(100),
    certificate_date DATE,
    owner_id INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_owner (owner_id),
    FOREIGN KEY (owner_id) REFERENCES persons(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tạo bảng documents
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    document_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    template_id INT,
    content TEXT,
    status ENUM('draft', 'pending', 'completed', 'cancelled') DEFAULT 'draft',
    notary_date DATE,
    notary_fee DECIMAL(10,2),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_document_number (document_number),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (template_id) REFERENCES contract_templates(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tạo bảng document_persons
CREATE TABLE document_persons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    document_id INT,
    person_id INT,
    role ENUM('party_a', 'party_b', 'witness', 'other') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_document_id (document_id),
    INDEX idx_person_id (person_id),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES persons(id)
);

-- Tạo bảng document_properties
CREATE TABLE document_properties (
    id INT PRIMARY KEY AUTO_INCREMENT,
    document_id INT,
    property_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_document_id (document_id),
    INDEX idx_property_id (property_id),
    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Chèn dữ liệu mẫu
-- Tạo users (password: "password")
INSERT INTO users (username, email, password_hash, full_name, role) VALUES 
('admin', 'admin@notary.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Quản trị viên', 'admin'),
('user1', 'user1@notary.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Thị Thu Hà', 'user'),
('user2', 'user2@notary.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trần Văn Nam', 'user');

-- Tạo mẫu hợp đồng
INSERT INTO contract_templates (name, category, content, variables, created_by) VALUES 
('Hợp đồng chuyển nhượng quyền sử dụng đất', 'Bất động sản', 
'HỢP ĐỒNG CHUYỂN NHƯỢNG QUYỀN SỬ DỤNG ĐẤT

Hôm nay, ngày {{ngay_ky}} tháng {{thang_ky}} năm {{nam_ky}}, tại {{dia_diem_ky}}, chúng tôi gồm có:

BÊN CHUYỂN NHƯỢNG (Bên A):
Ông/Bà: {{ten_ben_a}}
Sinh năm: {{nam_sinh_a}}
CMND/CCCD số: {{cmnd_a}} cấp ngày {{ngay_cap_a}} tại {{noi_cap_a}}
Địa chỉ thường trú: {{dia_chi_a}}

BÊN NHẬN CHUYỂN NHƯỢNG (Bên B):
Ông/Bà: {{ten_ben_b}}
Sinh năm: {{nam_sinh_b}}
CMND/CCCD số: {{cmnd_b}} cấp ngày {{ngay_cap_b}} tại {{noi_cap_b}}
Địa chỉ thường trú: {{dia_chi_b}}

THỎA THUẬN:
Bên A đồng ý chuyển nhượng quyền sử dụng đất tại {{dia_chi_dat}} với diện tích {{dien_tich}}m2 cho Bên B với giá {{gia_chuyen_nhuong}} VNĐ.

Giá trị giao dịch: {{gia_chuyen_nhuong}} VNĐ (Bằng chữ: {{gia_bang_chu}})

Hợp đồng có hiệu lực từ ngày ký.', 
'["ten_ben_a", "nam_sinh_a", "cmnd_a", "ngay_cap_a", "noi_cap_a", "dia_chi_a", "ten_ben_b", "nam_sinh_b", "cmnd_b", "ngay_cap_b", "noi_cap_b", "dia_chi_b", "dia_chi_dat", "dien_tich", "gia_chuyen_nhuong", "gia_bang_chu", "ngay_ky", "thang_ky", "nam_ky", "dia_diem_ky"]', 1),

('Hợp đồng mua bán nhà ở', 'Bất động sản', 
'HỢP ĐỒNG MUA BÁN NHÀ Ở

Hôm nay, ngày {{ngay_ky}} tháng {{thang_ky}} năm {{nam_ky}}, tại {{dia_diem_ky}}, chúng tôi gồm có:

BÊN BÁN (Bên A):
Ông/Bà: {{ten_ben_a}}
Sinh năm: {{nam_sinh_a}}
CMND/CCCD số: {{cmnd_a}} cấp ngày {{ngay_cap_a}} tại {{noi_cap_a}}
Địa chỉ thường trú: {{dia_chi_a}}

BÊN MUA (Bên B):
Ông/Bà: {{ten_ben_b}}
Sinh năm: {{nam_sinh_b}}
CMND/CCCD số: {{cmnd_b}} cấp ngày {{ngay_cap_b}} tại {{noi_cap_b}}
Địa chỉ thường trú: {{dia_chi_b}}

THỎA THUẬN:
Bên A đồng ý bán cho Bên B căn nhà tại {{dia_chi_nha}} với diện tích {{dien_tich}}m2, giá {{gia_ban}} VNĐ.

Giá trị giao dịch: {{gia_ban}} VNĐ (Bằng chữ: {{gia_bang_chu}})

Hợp đồng có hiệu lực từ ngày ký.', 
'["ten_ben_a", "nam_sinh_a", "cmnd_a", "ngay_cap_a", "noi_cap_a", "dia_chi_a", "ten_ben_b", "nam_sinh_b", "cmnd_b", "ngay_cap_b", "noi_cap_b", "dia_chi_b", "dia_chi_nha", "dien_tich", "gia_ban", "gia_bang_chu", "ngay_ky", "thang_ky", "nam_ky", "dia_diem_ky"]', 1),

('Hợp đồng thuê nhà', 'Bất động sản', 
'HỢP ĐỒNG THUÊ NHÀ

Hôm nay, ngày {{ngay_ky}} tháng {{thang_ky}} năm {{nam_ky}}, tại {{dia_diem_ky}}, chúng tôi gồm có:

BÊN CHO THUÊ (Bên A):
Ông/Bà: {{ten_ben_a}}
Sinh năm: {{nam_sinh_a}}
CMND/CCCD số: {{cmnd_a}} cấp ngày {{ngay_cap_a}} tại {{noi_cap_a}}
Địa chỉ thường trú: {{dia_chi_a}}

BÊN THUÊ (Bên B):
Ông/Bà: {{ten_ben_b}}
Sinh năm: {{nam_sinh_b}}
CMND/CCCD số: {{cmnd_b}} cấp ngày {{ngay_cap_b}} tại {{noi_cap_b}}
Địa chỉ thường trú: {{dia_chi_b}}

THỎA THUẬN:
Bên A đồng ý cho Bên B thuê nhà tại {{dia_chi_nha}} với mức giá {{gia_thue}} VNĐ/tháng.

Thời hạn thuê: {{thoi_han}} tháng
Tiền cọc: {{tien_coc}} VNĐ

Hợp đồng có hiệu lực từ ngày ký.', 
'["ten_ben_a", "nam_sinh_a", "cmnd_a", "ngay_cap_a", "noi_cap_a", "dia_chi_a", "ten_ben_b", "nam_sinh_b", "cmnd_b", "ngay_cap_b", "noi_cap_b", "dia_chi_b", "dia_chi_nha", "gia_thue", "thoi_han", "tien_coc", "ngay_ky", "thang_ky", "nam_ky", "dia_diem_ky"]', 1);

-- Tạo đương sự mẫu
INSERT INTO persons (full_name, id_number, id_issued_date, id_issued_place, birth_date, gender, phone, email, address, created_by) VALUES 
('Nguyễn Văn A', '001234567890', '2020-01-15', 'CA Hà Nội', '1985-03-20', 'male', '0901234567', 'nguyenvana@email.com', '123 Đường ABC, Quận 1, TP.HCM', 1),
('Trần Thị B', '001234567891', '2020-02-10', 'CA TP.HCM', '1990-07-15', 'female', '0901234568', 'tranthib@email.com', '456 Đường XYZ, Quận 2, TP.HCM', 1),
('Lê Văn C', '001234567892', '2020-03-05', 'CA Đà Nẵng', '1988-12-10', 'male', '0901234569', 'levanc@email.com', '789 Đường DEF, Quận 3, TP.HCM', 1),
('Phạm Thị D', '001234567893', '2020-04-20', 'CA Hải Phòng', '1992-05-25', 'female', '0901234570', 'phamthid@email.com', '101 Đường GHI, Quận 4, TP.HCM', 1);

-- Tạo tài sản mẫu
INSERT INTO properties (type, name, description, address, area, value, ownership_certificate, certificate_date, owner_id, created_by) VALUES 
('Nhà ở', 'Nhà phố 3 tầng', 'Nhà phố 3 tầng, 4 phòng ngủ, 3 phòng tắm', '123 Đường ABC, Quận 1, TP.HCM', 120.50, 5500000000, 'SHR123456789', '2020-01-01', 1, 1),
('Đất nền', 'Lô đất thổ cư', 'Lô đất thổ cư, mặt tiền đường', '456 Đường XYZ, Quận 2, TP.HCM', 200.00, 8000000000, 'SHR987654321', '2020-02-01', 2, 1),
('Căn hộ', 'Căn hộ chung cư', 'Căn hộ 2 phòng ngủ, tầng 15', '789 Đường DEF, Quận 3, TP.HCM', 85.00, 3500000000, 'SHR456789123', '2020-03-01', 3, 1),
('Nhà ở', 'Biệt thự vườn', 'Biệt thự 2 tầng có sân vườn', '101 Đường GHI, Quận 4, TP.HCM', 300.00, 12000000000, 'SHR789123456', '2020-04-01', 4, 1);

-- Tạo hồ sơ mẫu
INSERT INTO documents (document_number, title, template_id, content, status, notary_date, notary_fee, created_by) VALUES 
('20250001', 'Hợp đồng chuyển nhượng quyền sử dụng đất - Nguyễn Văn A', 1, 'Nội dung hợp đồng đã hoàn thiện...', 'completed', '2025-01-15', 2000000, 2),
('20250002', 'Hợp đồng mua bán nhà ở - Trần Thị B', 2, 'Nội dung hợp đồng đã hoàn thiện...', 'pending', '2025-01-20', 5000000, 2),
('20250003', 'Hợp đồng thuê nhà - Lê Văn C', 3, 'Nội dung hợp đồng đang soạn thảo...', 'draft', NULL, 500000, 3),
('20250004', 'Hợp đồng chuyển nhượng quyền sử dụng đất - Phạm Thị D', 1, 'Nội dung hợp đồng đang xem xét...', 'pending', '2025-01-25', 3000000, 3);

-- Liên kết hồ sơ với đương sự
INSERT INTO document_persons (document_id, person_id, role) VALUES 
(1, 1, 'party_a'),
(1, 2, 'party_b'),
(2, 2, 'party_a'),
(2, 3, 'party_b'),
(3, 3, 'party_a'),
(3, 4, 'party_b'),
(4, 4, 'party_a'),
(4, 1, 'party_b');

-- Liên kết hồ sơ với tài sản
INSERT INTO document_properties (document_id, property_id) VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4);

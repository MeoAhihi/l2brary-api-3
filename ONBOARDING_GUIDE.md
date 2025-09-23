# Hướng Dẫn Onboarding

Chào mừng bạn đến với dự án L2brary API! Tài liệu này được soạn thảo nhằm giúp các lập trình viên, có thể nhanh chóng nắm bắt và làm việc hiệu quả với codebase backend này.

**Stack công nghệ chính:**

- **Framework:** NestJS (một framework Node.js mạnh mẽ, sử dụng TypeScript)
- **Ngôn ngữ:** TypeScript
- **ORM & Database:** TypeORM & MySQL
- **Quản lý package:** PNPM

---

## Phần 1: Cài Đặt Môi Trường

Thực hiện các bước sau để chạy dự án trên máy local của bạn.

### 1.1. Yêu cầu tiên quyết

- **Node.js:** phiên bản 20.x hoặc mới hơn.
- **PNPM:** Cài đặt bằng lệnh `npm install -g pnpm`.
- **Docker:** Để chạy database MySQL một cách dễ dàng.

### 1.2. Các bước cài đặt

1.  **Clone repository:**

    ```bash
    git clone <your-repo-url>
    cd l2brary-api-3
    ```

2.  **Cài đặt dependencies:**
    Dự án sử dụng `pnpm`, hãy đảm bảo bạn dùng đúng lệnh.

    ```bash
    pnpm install
    ```

3.  **Cấu hình biến môi trường:**
    Copy file `.env.example` thành một file mới tên là `.env`.

    ```bash
    cp .env.example .env
    ```

    Mở file `.env` và cập nhật các thông tin cần thiết, quan trọng nhất là cấu hình database. Thông thường, bạn sẽ giữ nguyên giá trị mặc định nếu dùng Docker.

4.  **Khởi chạy Database:**
    Cách đơn giản nhất là sử dụng Docker. Nếu chưa có file `docker-compose.yml`, bạn có thể tạo một file đơn giản để chạy MySQL:

    ```yaml
    # docker-compose.yml
    services:
      db:
        image: mysql:8.0
        restart: always
        environment:
          MYSQL_ROOT_PASSWORD: "root"
          MYSQL_DATABASE: "l2brary"
        ports:
          - "3306:3306"
        volumes:
          - db_data:/var/lib/mysql
    volumes:
      db_data:
    ```

    Sau đó chạy lệnh:

    ```bash
    docker compose up -d
    ```

5.  **Chạy Database Migrations:**
    Lệnh này sẽ cập nhật schema của database dựa trên các file migration có sẵn trong source code.

    ```bash
    pnpm run migration:run
    ```

6.  **Khởi động ứng dụng:**
    Chạy ứng dụng ở chế độ development (tự động reload khi có thay đổi).

    ```bash
    pnpm run start:dev
    ```

7.  **Kiểm tra:**
    Khi server đã chạy, bạn có thể truy cập vào `http://localhost:3000` (hoặc port bạn cấu hình trong `.env`). Bạn sẽ thấy thông báo "Hello World!" hoặc tương tự.

    Để xem toàn bộ các API có sẵn, hãy truy cập trang Swagger tại:
    `http://localhost:3000/api`

---

## Phần 2: Tổng Quan về Kiến Trúc NestJS

Hiểu rõ các khái niệm cốt lõi của NestJS là chìa khóa để làm việc hiệu quả. Dưới đây là các thành phần chính bạn sẽ tương tác.

![NestJS Architecture](https://docs.nestjs.com/assets/Controllers_1.png)

- **`Controller`**:
  - **Chức năng:** Tiếp nhận các request HTTP đến và trả về response. Nó tương đương với `API Routes` trong Next.js.
  - **Vị trí:** `*.controller.ts` (ví dụ: `user.controller.ts`).
  - Controller định nghĩa các endpoint (ví dụ: `/users`, `/users/:id`) và các phương thức HTTP (GET, POST, PUT, DELETE).

- **`Service`**:
  - **Chức năng:** Chứa toàn bộ business logic. Controller sẽ gọi các phương thức trong Service để xử lý dữ liệu, tính toán, tương tác với database, v.v.
  - **Vị trí:** `*.service.ts` (ví dụ: `user.service.ts`).
  - Việc tách logic ra Service giúp code sạch sẽ, dễ bảo trì và tái sử dụng.

- **`Module`**:
  - **Chức năng:** Đóng gói một nhóm các `Controller`, `Service` và các `Provider` khác có liên quan đến một domain cụ thể. Nó giúp tổ chức code theo từng "tính năng" (feature).
  - **Vị trí:** `*.module.ts` (ví dụ: `user.module.ts`).
  - Dự án này được chia thành nhiều module trong thư mục `src/modules`.

- **`DTO` (Data Transfer Object)**:
  - **Chức năng:** Là các class định nghĩa "hình dạng" (shape) của dữ liệu được gửi đi trong request (body, query params) hoặc trả về trong response. DTOs sử dụng `class-validator` để tự động validate dữ liệu đầu vào.
  - **Vị trí:** `dto/*.dto.ts` (ví dụ: `create-user.dto.ts`).
  - Đây chính là "hợp đồng" (contract) giữa front-end và back-end.

- **`Entity`**:
  - **Chức năng:** Là các class được TypeORM sử dụng để ánh xạ tới các bảng trong database. Mỗi instance của một Entity tương ứng với một hàng (row) trong bảng.
  - **Vị trí:** `entities/*.entity.ts` (ví dụ: `user.entity.ts`).
  - Nó định nghĩa schema của bảng (tên cột, kiểu dữ liệu, quan hệ).

---

## Phần 3: Cấu Trúc Thư Mục Chi Tiết

Dưới đây là giải thích về các thư mục quan trọng trong `src/modules`:

- `aa/` (Analytics): Module liên quan đến phân tích dữ liệu, theo dõi tăng trưởng.
- `ae/` (Activity/Engagement): Module về hoạt động người dùng và các yếu tố "gamification" (game hoá).
- `database/`: Chứa các cấu hình liên quan đến TypeORM và kết nối database.
- `iam/` (Identity & Access Management): Module cực kỳ quan trọng, quản lý Người dùng (`User`), xác thực, phân quyền.
- `ks/` (Knowledge System): Module quản lý các tài nguyên tri thức như Bài viết (`Article`).
- `ld/` (Learning & Development): Module lớn nhất, chứa các tính năng cốt lõi về học tập:
  - `course/`: Quản lý các khoá học.
  - `enrollment/`: Quản lý việc đăng ký học của người dùng.
  - `game/`: Các trò chơi học tập.
  - `session/`: Quản lý các buổi học, điểm danh.

---

## Phần 4: Luồng Làm Việc Thường Gặp

**Tình huống:** Bạn cần thêm một API mới để lấy danh sách các khoá học nổi bật (`GET /courses/featured`).

1.  **Xác định Module:** Chức năng này thuộc về `course`, vậy chúng ta sẽ làm việc trong `src/modules/ld/course`.

2.  **Tạo Route trong Controller:**
    Mở file `course.controller.ts`. Thêm một phương thức mới:

    ```typescript
    @Get('featured')
    findFeatured() {
      return this.courseService.findFeatured();
    }
    ```

3.  **Thêm Logic vào Service:**
    Mở file `course.service.ts`. Thêm phương thức `findFeatured`:

    ```typescript
    // (Giả sử bạn đã inject repository của TypeORM)
    async findFeatured(): Promise<Course[]> {
      // Viết logic để truy vấn database, ví dụ:
      return this.courseRepository.find({
        where: { isFeatured: true },
        take: 10
      });
    }
    ```

4.  **Định nghĩa DTO (nếu cần):**
    Nếu API cần tham số (ví dụ: `limit`), bạn sẽ tạo/cập nhật một DTO trong thư mục `dto/` và dùng nó trong Controller.

5.  **Kiểm tra:**
    Chạy server và dùng Postman hoặc truy cập `http://localhost:3000/api` để test endpoint mới.

---

## Phần 5: API Documentation & Testing

- **API Documentation:** Dự án sử dụng `@nestjs/swagger`. Toàn bộ API đều được tự động tạo tài liệu. Hãy luôn mở trang `http://localhost:3000/api` khi làm việc để xem danh sách endpoint, DTOs và thử nghiệm trực tiếp.
- **Testing:** Để chạy bộ test end-to-end, sử dụng lệnh:
  ```bash
  pnpm run test:e2e
  ```

---

## Phụ Lục: Giải Thích Thuật Ngữ

- **NestJS:** Một framework Node.js để xây dựng các ứng dụng phía server hiệu quả, đáng tin cậy và có khả năng mở rộng.
- **TypeORM:** Một Object-Relational Mapper (ORM) cho phép bạn tương tác với database (MySQL, PostgreSQL, etc.) bằng cách sử dụng các đối tượng và class trong TypeScript thay vì viết SQL thuần.
- **Controller:** Lớp xử lý các request đến và trả về response cho client.
- **Service (Provider):** Một lớp chứa business logic, được thiết kế để tách biệt logic khỏi Controller.
- **Module:** Một lớp dùng để tổ chức cấu trúc ứng dụng, nhóm các thành phần liên quan lại với nhau.
- **DTO (Data Transfer Object):** Một đối tượng định nghĩa cách dữ liệu được gửi qua mạng. Nó hoạt động như một "hợp đồng" API.
- **Entity:** Một lớp ánh xạ tới một bảng trong database.
- **Repository Pattern:** Một mẫu thiết kế được TypeORM sử dụng để cung cấp các phương thức trừu tượng giúp tương tác với database (như `find`, `save`, `delete`).
- **PNPM:** Một trình quản lý package cho Node.js, nhanh và hiệu quả hơn về dung lượng đĩa so với NPM hoặc Yarn.
- **Migration:** Một cách để quản lý sự thay đổi của schema database một cách có phiên bản và tự động.

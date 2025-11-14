# 📘 Tài liệu Phát triển 代收 API (Thu phí)

Tài liệu này mô tả **quy tắc ký số**, **tham số yêu cầu**, **định dạng trả về** và **các API chính** cho hệ thống thu phí (代收). Nội dung được chuyển đổi từ bản gốc tiếng Trung sang tiếng Việt, giữ nguyên đầy đủ ý nghĩa và cấu trúc.

---

## 🔐 1. Thuật toán ký số (Sign)

### 1.1 Quy trình ký số

**Bước 1:**

- Tập hợp tất cả các tham số mà bên gọi API gửi đi hoặc nhận về vào một tập hợp `M`.
- Chỉ lấy **những tham số không rỗng** và **có tham gia ký số**.
- Sắp xếp các tham số trong `M` theo **thứ tự ASCII tăng dần** của tên trường (giống sắp xếp từ điển).
- Ghép các tham số lại theo format URL key–value:

```text
key1=value1&key2=value2&key3=value3...
```

**Bước 2:**

- Ở cuối chuỗi vừa ghép, nối thêm:

```text
&key=apikey
```

- Thực hiện **MD5** lên chuỗi này, thu được `stringSignTemp`.
- Chuyển toàn bộ `stringSignTemp` sang **chữ in hoa** để được **giá trị `sign` cuối cùng**.

**Ví dụ:**

```text
stringSignTemp = strtoupper(
    md5(
        "accountname=accountname&bankname=bankname&cardnumber=cardnumber"
        + "&mchid=mchid&money=money&out_trade_no=out_trade_no"
        + "&subbranch=subbranch&key=key"
    )
)
```

---

### 1.2 Lưu ý chung

- **Tất cả các trường dữ liệu đều sử dụng kiểu chuỗi (string).**
- Khi hệ thống gọi **callback** về phía thương nhân, nếu xử lý thành công, bên thương nhân phải trả về:

```text
success
```

Nếu không trả về chính xác chuỗi trên, hệ thống có thể lặp lại việc gửi callback nhiều lần.

---

## 🧾 1.1 API Tạo Đơn Hàng (Phiên bản gửi Form)

- **Đường dẫn (Endpoint):** `网关/v1/dsapi/add`
- **Phương thức:** `POST`
- **Cách gửi:** Sử dụng **POST FORM**, gửi trực tiếp theo định dạng form.

### 1.1.1 Tham số yêu cầu

| Tên tham số    | Ý nghĩa              | Bắt buộc | Tham gia ký số | Mô tả / Ghi chú                                                                              |
| ---------------- | ---------------------- | ---------- | ---------------- | ----------------------------------------------------------------------------------------------- |
| `mchid`        | Mã thương nhân     | Có        | Có              | Mã thương nhân được nền tảng cấp                                                      |
| `out_trade_no` | Mã đơn hàng        | Có        | Có              | Mã đơn của thương nhân, yêu cầu**duy nhất**                                     |
| `money`        | Số tiền              | Có        | Có              | Đơn vị:**Nhân dân tệ (元)**, **giữ 2 chữ số thập phân**                  |
| `notifyurl`    | URL callback           | Có        | Có              | Địa chỉ nhận thông báo kết quả thanh toán                                              |
| `code`         | Mã kênh              | Có        | Có              | Mã kênh thanh toán, liên hệ CS để được cung cấp                                      |
| `applydate`    | Thời gian đặt đơn | Có        | Có              | Định dạng:`2001-01-01 18:00:00`                                                            |
| `returnurl`    | URL chuyển hướng    | Không     | Không           | Khi thanh toán thành công hoặc thất bại sẽ tự động chuyển đến địa chỉ này      |
| `productname`  | Tên sản phẩm        | Không     | Không           | Tuỳ chọn, tên hiển thị của sản phẩm                                                     |
| `attach`       | Thông tin đính kèm | Không     | Không           | Tuỳ chọn, nội dung này sẽ được trả về nguyên vẹn                                    |
| `submitname`   | Người thanh toán    | Không     | Không           | Tuỳ chọn, một số kênh rút tiền yêu cầu phải truyền;**không tham gia ký số** |
| `sign`         | Chữ ký               | Có        | Có              | Chữ ký được tạo theo thuật toán ký số ở mục 1                                       |

### 1.1.2 Kết quả trả về

- Trả về **trang HTML** (page) dùng để thực hiện thanh toán hoặc hiển thị nội dung SDK.

---

## 🧾 1.2 API Tạo Đơn Hàng (Phiên bản trả về JSON)

- **Đường dẫn (Endpoint):** `网关/v1/dsapi/add2`
- **Phương thức:** `POST`
- **Cách gửi:** `POST FORM`

### 1.2.1 Tham số yêu cầu

Các tham số **giống hoàn toàn** với mục **1.1 – API Tạo Đơn Hàng (Form Submit)**, bao gồm:

`mchid`, `out_trade_no`, `money`, `notifyurl`, `code`, `applydate`, `returnurl`, `productname`, `attach`, `submitname`, `sign`
→ Ý nghĩa, tính bắt buộc, và cách ký số giống hệt mục 1.1.

### 1.2.2 Kết quả trả về (định dạng JSON)

**Trường dữ liệu JSON chính:**

| Tên trường    | Ý nghĩa                 | Ghi chú                                                 |
| ---------------- | ------------------------- | -------------------------------------------------------- |
| `status`       | Trạng thái              | `success` = thành công, giá trị khác = thất bại |
| `msg`          | Mô tả trạng thái      | Thông tin mô tả tương ứng với `status`          |
| `order_no`     | Mã đơn của nền tảng | Mã đơn hệ thống nội bộ                            |
| `out_trade_no` | Mã đơn thương nhân  | Mã đơn phía merchant đã gửi lên                  |

**Các trường khác có thể trả về:**

| Tên trường | Ý nghĩa              | Bắt buộc | Mô tả / Ghi chú                                                                                                           |
| ------------- | ---------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `html`      | Nội dung trang        | Có        | Trả về nội dung**HTML** hoặc nội dung sử dụng trong **SDK**                                               |
| `pay_url`   | Địa chỉ thanh toán | Không     | Nếu có giá trị thì có thể dùng URL này để mở trang thanh toán; nếu không có thì sử dụng trường `html` |
| `sign`      | Chữ ký               | Không     | Chữ ký đi kèm dữ liệu trả về (tuỳ theo cấu hình kênh)                                                            |

---

## 💰 2. API Tra Cứu Số Dư

- **Đường dẫn (Endpoint):** `网关/v1/dsapi/query_balance`
- **Phương thức:** `POST`
- **Cách gửi:** `POST FORM`

### 2.1 Tham số yêu cầu

| Tên tham số | Ý nghĩa          | Bắt buộc | Tham gia ký số | Mô tả / Ghi chú                              |
| ------------- | ------------------ | ---------- | ---------------- | ----------------------------------------------- |
| `mchid`     | Mã thương nhân | Có        | Có              | Mã thương nhân được phân phối          |
| `sign`      | Chữ ký           | Có        | Không           | Dùng để xác minh, dựa trên khóa mã hoá |

### 2.2 Kết quả trả về (JSON)

| Tên trường      | Ý nghĩa            | Mô tả / Ghi chú                                 |
| ------------------ | -------------------- | -------------------------------------------------- |
| `status`         | Trạng thái         | `success` = thành công, `error` = thất bại |
| `msg`            | Mô tả trạng thái | Mô tả chi tiết lý do                           |
| `balance`        | Số dư khả dụng   | Trả về khi thành công                          |
| `freeze_balance` | Số dư đóng băng | Trả về khi thành công                          |

---

## 📦 3. API Tra Cứu Đơn Hàng

- **Đường dẫn (Endpoint):** `网关/v1/dsapi/query_order`
- **Phương thức:** `POST`
- **Cách gửi:** `POST FORM`

### 3.1 Tham số yêu cầu

| Tên tham số    | Ý nghĩa                | Bắt buộc | Tham gia ký số | Mô tả / Ghi chú                     |
| ---------------- | ------------------------ | ---------- | ---------------- | -------------------------------------- |
| `out_trade_no` | Mã đơn thương nhân | Có        | Có              | Mã đơn do thương nhân tạo       |
| `mchid`        | Mã thương nhân       | Có        | Có              | Mã thương nhân được phân phối |
| `sign`         | Chữ ký                 | Có        | Không           | Dùng để kiểm tra tính hợp lệ    |

### 3.2 Kết quả trả về (JSON)

| Tên trường      | Ý nghĩa                 | Mô tả / Ghi chú                                                                                                                                     |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `status`         | Trạng thái              | `success` = yêu cầu truy vấn **thực hiện thành công** (không đồng nghĩa nghiệp vụ thành công), `error` = yêu cầu thất bại |
| `msg`            | Mô tả trạng thái      | Có thể trống hoặc mô tả bổ sung                                                                                                                 |
| `mchid`          | Mã thương nhân        | Trả về khi `status = success`                                                                                                                      |
| `out_trade_no`   | Mã đơn thương nhân  | Trả về khi `status = success`                                                                                                                      |
| `amount`         | Số tiền                 | Trả về khi `status = success`                                                                                                                      |
| `transaction_id` | Mã giao dịch nền tảng | Trả về khi `status = success`                                                                                                                      |
| `refCode`        | Trạng thái nghiệp vụ  | Trả về khi `status = success`. Giá trị: `1` = chưa xử lý, `2` = đã thanh toán, `3` = đã huỷ, `4` = đã hoàn lại              |
| `refMsg`         | Mô tả nghiệp vụ       | Mô tả chi tiết trạng thái nghiệp vụ                                                                                                             |
| `success_time`   | Thời gian thành công   | Trả về khi `status = success` **và** `refCode = 2` (đã thanh toán)                                                                     |
| `attach`         | Thông tin đính kèm    | Nội dung được gửi kèm khi tạo đơn, trả về**nguyên bản**                                                                             |
| `sign`           | Chữ ký                  | Chữ ký của dữ liệu trả về (nếu có cấu hình)                                                                                                 |

---

## 🔄 4. API Thông Báo Bất Đồng Bộ (Async Notify)

- **Hình thức:** Gửi **POST FORM** từ hệ thống thanh toán sang URL `notifyurl` của thương nhân.
- **Yêu cầu phản hồi:**
  - Thương nhân **bắt buộc** trả về chuỗi:

    ```text
    success
    ```
  - Nếu không nhận được phản hồi chính xác, hệ thống sẽ **gửi lại thông báo nhiều lần** (không cố định số lần).

### 4.1 Tham số thông báo (POST FORM)

| Tên tham số      | Ý nghĩa                 | Bắt buộc | Tham gia ký số | Mô tả / Ghi chú                                                                                     |
| ------------------ | ------------------------- | ---------- | ---------------- | ------------------------------------------------------------------------------------------------------ |
| `mchid`          | Mã thương nhân        | Có        | Có              |                                                                                                        |
| `out_trade_no`   | Mã đơn thương nhân  | Có        | Có              |                                                                                                        |
| `amount`         | Số tiền                 | Có        | Có              |                                                                                                        |
| `transaction_id` | Mã giao dịch nền tảng | Có        | Có              |                                                                                                        |
| `refCode`        | Trạng thái nghiệp vụ  | Có        | Có              | Giá trị phổ biến:`2` = đã thanh toán; các giá trị khác = thất bại / không thành công |
| `refMsg`         | Mô tả nghiệp vụ       | Có        | Có              | Mô tả văn bản về kết quả nghiệp vụ                                                            |
| `success_time`   | Thời gian thành công   | Không     | Có / tuỳ kênh | Thời gian giao dịch được xác nhận thành công                                                  |
| `attach`         | Thông tin đính kèm    | Không     | Có / tuỳ kênh | Dữ liệu đính kèm gửi khi tạo đơn, trả lại nguyên bản                                      |
| `sign`           | Chữ ký                  | Không     | Không           | Chữ ký của thông báo (nếu kênh hỗ trợ)                                                        |

---

## ✅ Ghi chú cuối

- Mọi trường dữ liệu đều là **string**.
- Việc ký số cần tuân thủ đúng thứ tự tham số và quy tắc MD5 + in hoa như mục 1.
- Phản hồi `"success"` trong callback là **bắt buộc** để xác nhận đã nhận được thông báo.

Tài liệu này đã được chuyển đầy đủ từ bản gốc PDF, giữ trọn nội dung và ý nghĩa, sẵn sàng dùng làm `README.md` trong dự án.
